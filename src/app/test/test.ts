import { BOX_API_BASE, BOX_CONFIG, BOX_TOKEN_URL } from './setting';

export interface BoxFileMetadata {
  id: string;
  name: string;
  size: number;
  created_at: string;
  modified_at: string;
  description?: string;
}

interface BoxError {
  status: number;
  code: string;
  message: string;
}

export async function getBoxFileMetadata(fileId: string): Promise<BoxFileMetadata> {
  try {
    const res = await fetch(`${BOX_API_BASE}/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${BOX_CONFIG.accessToken}`,
      },
    });
    
    if (!res.ok) {
      const error: BoxError = await res.json();
      throw new Error(`Box API Error: ${error.message}`);
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching file metadata:', error);
    throw error;
  }
}

export async function getBoxFileDownloadUrl(fileId: string): Promise<string> {
  try {
    const res = await fetch(`${BOX_API_BASE}/files/${fileId}/content`, {
      headers: {
        Authorization: `Bearer ${BOX_CONFIG.accessToken}`,
        Redirect: 'manual',
      },
    });

    if (!res.ok) {
      const error: BoxError = await res.json();
      throw new Error(`Box API Error: ${error.message}`);
    }

    const redirectUrl = res.headers.get('location');
    if (!redirectUrl) {
      throw new Error('No download URL received from Box API');
    }

    return redirectUrl;
  } catch (error) {
    console.error('Error getting download URL:', error);
    throw error;
  }
}

export async function refreshAccessToken(): Promise<void> {
  try {
    const res = await fetch(BOX_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: BOX_CONFIG.refreshToken,
        client_id: BOX_CONFIG.clientId,
        client_secret: BOX_CONFIG.clientSecret,
      }),
    });

    if (!res.ok) {
      const error: BoxError = await res.json();
      throw new Error(`Token refresh failed: ${error.message}`);
    }

    await res.json(); // レスポンスを確認するためだけに使用
    console.log('Access token refreshed successfully');
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}