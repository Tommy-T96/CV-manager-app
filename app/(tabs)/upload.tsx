import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useCVStore } from '@/hooks/useCVStore';
import { pickDocument, extractTextFromCV, parseCV } from '@/utils/fileUtils';
import { FileUp, Check } from 'lucide-react-native';
import { CV } from '@/types/cv';

export default function UploadScreen() {
  const router = useRouter();
  const { addCV } = useCVStore();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    uri: string;
    mimeType?: string;
    size?: number;
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<Partial<CV> | null>(null);
  
  const handlePickDocument = async () => {
    try {
      const result = await pickDocument();
      
      if (result) {
        setUploadedFile({
          name: result.name,
          uri: result.uri,
          mimeType: result.mimeType,
          size: result.size,
        });
        
        // Simulate upload progress
        setIsUploading(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            const newProgress = prev + 0.1;
            if (newProgress >= 1) {
              clearInterval(interval);
              setIsUploading(false);
              return 1;
            }
            return newProgress;
          });
        }, 100);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };
  
  const handleParseCV = async () => {
    if (!uploadedFile) return;
    
    try {
      setIsParsing(true);
      
      // Extract text from the CV
      const text = await extractTextFromCV(uploadedFile.uri, uploadedFile.mimeType || '');
      setExtractedText(text);
      
      // Parse the extracted text into structured data
      const data = await parseCV(text);
      setParsedData(data as Partial<CV>);
      
      setIsParsing(false);
    } catch (error) {
      console.error('Error parsing CV:', error);
      Alert.alert('Error', 'Failed to parse CV. Please try again.');
      setIsParsing(false);
    }
  };
  
  const handleSaveCV = () => {
    if (!parsedData) return;
    
    const newCV: CV = {
      id: Date.now().toString(),
      name: parsedData.name || 'Unknown',
      email: parsedData.email || 'unknown@example.com',
      phone: parsedData.phone,
      summary: parsedData.summary,
      education: parsedData.education || [],
      experience: parsedData.experience || [],
      skills: parsedData.skills || [],
      languages: parsedData.languages,
      publications: parsedData.publications,
      fileUrl: uploadedFile?.uri,
      fileType: uploadedFile?.mimeType,
      uploadDate: new Date().toISOString().split('T')[0],
      tags: [],
    };
    
    addCV(newCV);
    
    Alert.alert(
      'Success',
      'CV has been successfully uploaded and parsed.',
      [
        {
          text: 'View CV',
          onPress: () => {
            router.push(`/cv/${newCV.id}`);
          },
        },
        {
          text: 'OK',
          onPress: () => {
            // Reset the form
            setUploadedFile(null);
            setExtractedText(null);
            setParsedData(null);
            setUploadProgress(0);
          },
        },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload CV</Text>
        <Text style={styles.sectionDescription}>
          Upload a CV in PDF, Word, or plain text format. The system will automatically extract and parse the information.
        </Text>
        
        <View style={styles.uploadContainer}>
          {!uploadedFile ? (
            <Button
              title="Select Document"
              onPress={handlePickDocument}
              icon={<FileUp size={20} color={colors.white} />}
              fullWidth
            />
          ) : (
            <View style={styles.fileInfoContainer}>
              <Text style={styles.fileName}>{uploadedFile.name}</Text>
              {uploadedFile.size && (
                <Text style={styles.fileSize}>
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              )}
              
              {isUploading ? (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${uploadProgress * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {Math.round(uploadProgress * 100)}%
                  </Text>
                </View>
              ) : (
                <View style={styles.uploadComplete}>
                  <Check size={16} color={colors.success} />
                  <Text style={styles.uploadCompleteText}>Upload complete</Text>
                </View>
              )}
              
              <View style={styles.buttonGroup}>
                <Button
                  title="Change File"
                  onPress={handlePickDocument}
                  variant="outline"
                  disabled={isUploading}
                />
                <Button
                  title="Parse CV"
                  onPress={handleParseCV}
                  disabled={isUploading || isParsing}
                  loading={isParsing}
                />
              </View>
            </View>
          )}
        </View>
      </View>
      
      {extractedText && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extracted Text</Text>
          <View style={styles.textContainer}>
            <Text style={styles.extractedText}>{extractedText}</Text>
          </View>
        </View>
      )}
      
      {parsedData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parsed Data</Text>
          <View style={styles.parsedDataContainer}>
            <View style={styles.parsedField}>
              <Text style={styles.fieldLabel}>Name</Text>
              <Text style={styles.fieldValue}>{parsedData.name}</Text>
            </View>
            <View style={styles.parsedField}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValue}>{parsedData.email}</Text>
            </View>
            {parsedData.phone && (
              <View style={styles.parsedField}>
                <Text style={styles.fieldLabel}>Phone</Text>
                <Text style={styles.fieldValue}>{parsedData.phone}</Text>
              </View>
            )}
            {parsedData.summary && (
              <View style={styles.parsedField}>
                <Text style={styles.fieldLabel}>Summary</Text>
                <Text style={styles.fieldValue}>{parsedData.summary}</Text>
              </View>
            )}
            
            <Text style={styles.sectionSubtitle}>Education</Text>
            {parsedData.education?.map((edu, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemTitle}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={styles.listItemSubtitle}>
                  {edu.institution}, {edu.startDate} - {edu.endDate}
                </Text>
              </View>
            ))}
            
            <Text style={styles.sectionSubtitle}>Experience</Text>
            {parsedData.experience?.map((exp, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemTitle}>
                  {exp.position} at {exp.company}
                </Text>
                <Text style={styles.listItemSubtitle}>
                  {exp.startDate} - {exp.endDate}
                </Text>
                <Text style={styles.listItemDescription}>
                  {exp.description}
                </Text>
              </View>
            ))}
            
            <Text style={styles.sectionSubtitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {parsedData.skills?.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill.name}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Save CV"
                onPress={handleSaveCV}
                size="large"
                fullWidth
              />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
  },
  uploadContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  fileInfoContainer: {
    width: '100%',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.gray[600],
    width: 40,
    textAlign: 'right',
  },
  uploadComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadCompleteText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.success,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  textContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  extractedText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  parsedDataContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  parsedField: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.gray[600],
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 16,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 4,
  },
  listItemDescription: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skillBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  buttonContainer: {
    marginTop: 16,
  },
});