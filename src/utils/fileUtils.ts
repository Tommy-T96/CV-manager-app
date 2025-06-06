import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';

export const pickDocument = async () => {
  try {
    // For all platforms including Windows
    const result = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.pdf,
        DocumentPicker.types.doc,
        DocumentPicker.types.docx,
        DocumentPicker.types.plainText,
      ],
      copyTo: 'cachesDirectory',
    });

    if (result.length === 0) {
      return null;
    }

    return {
      name: result[0].name || 'document',
      uri: result[0].fileCopyUri || result[0].uri,
      mimeType: result[0].type,
      size: result[0].size,
    };
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      // User cancelled the picker
      return null;
    }
    console.error('Error picking document:', error);
    throw new Error('Failed to pick document');
  }
};

export const getFileInfo = async (fileUri: string) => {
  try {
    if (Platform.OS === 'web') {
      // Mock implementation for web (including Windows browsers)
      return {
        size: 1024 * 1024, // 1MB
        exists: true,
        isDirectory: false,
        modificationTime: Date.now(),
        uri: fileUri,
      };
    }

    const fileInfo = await RNFS.stat(fileUri);
    return {
      ...fileInfo,
      exists: true,
      uri: fileUri,
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    throw new Error('Failed to get file info');
  }
};

export const extractTextFromCV = async (fileUri: string, fileType: string) => {
  // This is a mock implementation since we can't actually parse documents on the client
  // In a real app, you would send the file to a server for processing

  return new Promise<string>(resolve => {
    setTimeout(() => {
      resolve(`This is extracted text from the CV. 
      It would contain information about the candidate's experience, education, skills, etc.
      In a real implementation, this would be the actual content of the document.`);
    }, 1500);
  });
};

export const parseCV = async (text: string) => {
  // This is a mock implementation
  // In a real app, you would use NLP or other techniques to extract structured data

  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+44 7123 456789',
        summary: 'Experienced software developer with a focus on web technologies.',
        education: [
          {
            institution: 'University of Technology',
            degree: 'BSc',
            field: 'Computer Science',
            startDate: '2015',
            endDate: '2019',
          },
        ],
        experience: [
          {
            company: 'Tech Company',
            position: 'Software Developer',
            startDate: '2019',
            endDate: 'Present',
            description: 'Developing web applications using modern technologies.',
          },
        ],
        skills: [{name: 'JavaScript'}, {name: 'React'}, {name: 'Node.js'}],
      });
    }, 1500);
  });
};