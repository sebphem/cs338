import { google } from 'googleapis';

// Initialize the Google Drive API client with an access token
export function initializeGoogleDrive(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return {
    drive: google.drive({ version: 'v3', auth }),
    docs: google.docs({ version: 'v1', auth })
  };
}

// Function to get content from a Google Doc
async function getGoogleDocContent(docs: any, docId: string): Promise<string | null> {
  try {
    const doc = await docs.documents.get({
      documentId: docId
    });

    if (!doc.data.body.content) {
      return null;
    }

    // Extract text content from the document
    let text = '';
    const content = doc.data.body.content;
    
    for (const element of content) {
      if (element.paragraph) {
        for (const paragraphElement of element.paragraph.elements) {
          if (paragraphElement.textRun && paragraphElement.textRun.content) {
            text += paragraphElement.textRun.content;
          }
        }
      }
    }

    return text;
  } catch (error) {
    console.error('Error getting Google Doc content:', error);
    return null;
  }
}

// Function to get random text content from Google Drive
export async function getRandomTextContent(accessToken: string): Promise<string | null> {
  try {
    const { drive, docs } = initializeGoogleDrive(accessToken);
    
    // List all text files and Google Docs in the user's drive
    const response = await drive.files.list({
      q: "(mimeType contains 'text/' or mimeType = 'application/vnd.google-apps.document') and trashed = false",
      fields: 'files(id, name, mimeType)',
      pageSize: 1000
    });

    const files = response.data.files;
    if (!files || files.length === 0) {
      throw new Error('No text files or Google Docs found in Google Drive');
    }

    // Select a random file
    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFile = files[randomIndex];

    // Handle different file types
    if (randomFile.mimeType === 'application/vnd.google-apps.document') {
      // Google Doc
      return await getGoogleDocContent(docs, randomFile.id!);
    } else {
      // Regular text file
      const content = await drive.files.get({
        fileId: randomFile.id!,
        alt: 'media'
      }, { responseType: 'text' });

      return content.data as string;
    }
  } catch (error) {
    console.error('Error getting random text from Google Drive:', error);
    return null;
  }
}

// Function to get a random image from Google Drive
export async function getRandomDriveImage(accessToken: string): Promise<string | null> {
  try {
    const { drive } = initializeGoogleDrive(accessToken);
    
    // List all image files in the user's drive
    const response = await drive.files.list({
      q: "mimeType contains 'image/' and trashed = false",
      fields: 'files(id, name)',
      pageSize: 1000
    });

    const files = response.data.files;
    if (!files || files.length === 0) {
      throw new Error('No images found in Google Drive');
    }

    // Select a random image from the list
    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFile = files[randomIndex];

    // Get the file metadata including the thumbnailLink
    const file = await drive.files.get({
      fileId: randomFile.id!,
      fields: 'thumbnailLink',
    });

    if (!file.data.thumbnailLink) {
      throw new Error('No thumbnail available for the selected image');
    }

    // Remove the "=s220" from the end of the URL to get full size image
    const fullSizeUrl = file.data.thumbnailLink.replace(/=s\d+$/, '');
    return fullSizeUrl;
  } catch (error) {
    console.error('Error getting random image from Google Drive:', error);
    return null;
  }
} 