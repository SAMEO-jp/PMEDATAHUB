import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createRecord } from '@src/lib/db/crud/db_CRUD';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const projectId = formData.get('projectId') as string;
    const albumId = formData.get('albumId') as string;
    
    console.log('Upload API - Project ID:', projectId);
    console.log('Upload API - Album ID:', albumId);
    console.log('Upload API - Files count:', files.length);
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'プロジェクトIDが指定されていません' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'photos', 'projects', projectId, 'images');
    
    // ディレクトリが存在しない場合は作成
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // ファイル名をサニタイズ
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${fileName}`;
      const filePath = join(uploadDir, uniqueFileName);

      // ファイルを保存
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      // データベースに写真メタデータを保存
      const photoData = {
        fk_project_id: projectId,
        photo_file_path: `/photos/projects/${projectId}/images/${uniqueFileName}`,
        photo_title: file.name,
        photo_category: 'others',
        photo_status: 'active',
        photo_uploaded_at: new Date().toISOString(),
        photo_updated_at: new Date().toISOString(),
      };

      const dbResult = await createRecord('photos', photoData);
      
      console.log('Photo creation result:', dbResult);
      
      if (!dbResult.success) {
        console.error('Database save failed:', dbResult.error);
        // ファイルは保存されているが、DB保存に失敗した場合の処理
      } else {
        // 写真の作成に成功した場合
        let photoId = null;
        
        // createRecordの戻り値の構造を確認
        if (dbResult.data && typeof dbResult.data === 'object') {
          // photo_idまたはidフィールドを確認
          if ('photo_id' in dbResult.data) {
            photoId = (dbResult.data as any).photo_id;
          } else if ('id' in dbResult.data) {
            photoId = (dbResult.data as any).id;
          } else if ('lastID' in dbResult.data) {
            // SQLiteのlastIDを使用
            photoId = (dbResult.data as any).lastID;
          }
        }
        
        console.log('Created photo ID:', photoId);
        console.log('Album ID from request:', albumId);
        
        if (albumId && photoId) {
          // アルバムと写真の関連付けを作成
          console.log('Creating album photo link for photo ID:', photoId);
          const albumPhotoData = {
            fk_album_id: parseInt(albumId),
            fk_photo_id: photoId,
            photo_order: 0,
          };
          
          console.log('Album photo data:', albumPhotoData);
          const albumPhotoResult = await createRecord('album_photos_link', albumPhotoData);
          if (!albumPhotoResult.success) {
            console.error('Album photo link failed:', albumPhotoResult.error);
          } else {
            console.log('Album photo link created successfully');
          }
        } else {
          console.log('Album ID not provided or photo ID not found');
          console.log('Album ID:', albumId);
          console.log('Photo ID:', photoId);
        }
      }

      uploadedFiles.push({
        originalName: file.name,
        fileName: uniqueFileName,
        filePath: `/photos/projects/${projectId}/images/${uniqueFileName}`,
        size: file.size,
        type: file.type,
        photoId: dbResult.success ? dbResult.data : null,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `${uploadedFiles.length}件のファイルがアップロードされました`,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'アップロードに失敗しました' },
      { status: 500 }
    );
  }
} 