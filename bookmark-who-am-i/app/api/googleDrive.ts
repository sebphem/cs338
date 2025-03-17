import { google } from 'googleapis';

// Initialize the Google Drive API client with an access token
export function initializeGoogleDrive(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  return google.drive({ version: 'v3', auth });
}

// Function to get random text content from Google Drive
export async function getRandomTextContent(accessToken: string): Promise<string | null> {
  try {
    const drive = initializeGoogleDrive(accessToken);
    
    // List all text files in the user's drive
    const response = await drive.files.list({
      q: "mimeType contains 'text/' and trashed = false",
      fields: 'files(id, name)',
      pageSize: 1000
    });

    const files = response.data.files;
    if (!files || files.length === 0) {
      throw new Error('No text files found in Google Drive');
    }

    // Select a random text file
    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFile = files[randomIndex];

    // Get the file content
    const content = await drive.files.get({
      fileId: randomFile.id!,
      alt: 'media'
    }, { responseType: 'text' });

    return content.data as string;
  } catch (error) {
    console.error('Error getting random text from Google Drive:', error);
    return null;
  }
}

// Function to get a random image from Google Drive
export async function getRandomDriveImage(accessToken: string): Promise<string | null> {
  try {
    const drive = initializeGoogleDrive(accessToken);
    
    // List all image files in the user's drive
    const response = await drive.files.list({
      q: "mimeType contains 'image/' and trashed = false",
      fields: 'files(id, name)',
      pageSize: 1000 // Adjust this number based on how many images you want to search through
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