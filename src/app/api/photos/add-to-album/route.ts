import { NextRequest, NextResponse } from 'next/server';
import { createRecord } from '@src/lib/db/db_CRUD';

export async function POST(request: NextRequest) {
  try {
    const { photoIds, albumId } = await request.json();

    console.log('Adding photos to album:', { photoIds, albumId });

    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json(
        { error: '写真IDが指定されていません' },
        { status: 400 }
      );
    }

    if (!albumId) {
      return NextResponse.json(
        { error: 'アルバムIDが指定されていません' },
        { status: 400 }
      );
    }

    const results = [];

    for (const photoId of photoIds) {
      // アルバムと写真の関連付けを作成
      const albumPhotoData = {
        fk_album_id: parseInt(albumId),
        fk_photo_id: parseInt(photoId),
        photo_order: 0,
      };

      console.log('Creating album photo link:', albumPhotoData);
      
      const result = await createRecord('album_photos_link', albumPhotoData);
      
      if (result.success) {
        console.log('Album photo link created successfully for photo ID:', photoId);
        results.push({
          photoId,
          success: true,
          message: 'アルバムに追加されました',
        });
      } else {
        console.error('Album photo link failed for photo ID:', photoId, result.error);
        results.push({
          photoId,
          success: false,
          error: result.error,
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `${successCount}件の写真をアルバムに追加しました${failureCount > 0 ? `（${failureCount}件失敗）` : ''}`,
      results,
    });

  } catch (error) {
    console.error('Add to album error:', error);
    return NextResponse.json(
      { error: 'アルバムへの追加に失敗しました' },
      { status: 500 }
    );
  }
} 