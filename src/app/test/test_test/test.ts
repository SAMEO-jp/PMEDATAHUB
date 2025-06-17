import BoxSDK from 'box-node-sdk';
import { BOX_CONFIG } from './setting';

const sdk = new BoxSDK({
  clientID: BOX_CONFIG.clientId,
  clientSecret: BOX_CONFIG.clientSecret,
});

const client = sdk.getBasicClient(BOX_CONFIG.developerToken);

export async function getFileMetadata(fileId: string) {
  try {
    const file = await client.files.get(fileId);
    return file;
  } catch (error) {
    throw new Error('Box API Error: ' + (error as Error).message);
  }
}

export async function getFileDownloadUrl(fileId: string) {
  try {
    const url = await client.files.getDownloadURL(fileId);
    return url;
  } catch (error) {
    throw new Error('Box API Error: ' + (error as Error).message);
  }
}