import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useCVStore} from '@/hooks/useCVStore';
import {colors} from '@/constants/colors';
import {Button} from '@/components/Button';
import {CVDetailSection} from '@/components/CVDetailSection';
import {TagInput} from '@/components/TagInput';
import {Trash2, Download} from 'lucide-react-native';
import {RootStackParamList} from '@/navigation/RootNavigator';

type CVDetailRouteProp = RouteProp<RootStackParamList, 'cv/detail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CVDetailScreen() {
  const route = useRoute<CVDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const {id} = route.params;
  const {
    selectedCV,
    selectCV,
    deleteCV,
    addTagToCV,
    removeTagFromCV,
  } = useCVStore();

  useEffect(() => {
    if (id) {
      selectCV(id);
    }

    return () => {
      // Clear selection when leaving the screen
      selectCV(null);
    };
  }, [id, selectCV]);

  useEffect(() => {
    if (selectedCV) {
      navigation.setOptions({
        title: selectedCV.name,
        headerRight: () => (
          <Button
            title="Delete"
            onPress={handleDeleteCV}
            variant="outline"
            size="small"
            icon={<Trash2 size={16} color={colors.error} />}
          />
        ),
      });
    }
  }, [selectedCV, navigation]);

  const handleDeleteCV = () => {
    Alert.alert(
      'Delete CV',
      'Are you sure you want to delete this CV? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (selectedCV) {
              deleteCV(selectedCV.id);
              navigation.goBack();
            }
          },
        },
      ],
    );
  };

  const handleDownloadCV = () => {
    Alert.alert(
      'Download CV',
      'This would download the original CV file in a real app.',
      [{text: 'OK'}],
    );
  };

  const handleAddTag = (tag: string) => {
    if (selectedCV) {
      addTagToCV(selectedCV.id, tag);
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (selectedCV) {
      removeTagFromCV(selectedCV.id, tag);
    }
  };

  if (!selectedCV) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading CV details...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.name}>{selectedCV.name}</Text>
        <Text style={styles.email}>{selectedCV.email}</Text>
        {selectedCV.phone && <Text style={styles.phone}>{selectedCV.phone}</Text>}

        <View style={styles.actionsContainer}>
          <Button
            title="Download Original"
            onPress={handleDownloadCV}
            variant="outline"
            icon={<Download size={16} color={colors.primary} />}
          />
        </View>
      </View>

      {selectedCV.summary && (
        <CVDetailSection title="Summary">
          <Text style={styles.summaryText}>{selectedCV.summary}</Text>
        </CVDetailSection>
      )}

      <CVDetailSection title="Experience">
        {selectedCV.experience.map((exp, index) => (
          <View key={index} style={styles.experienceItem}>
            <Text style={styles.positionText}>{exp.position}</Text>
            <Text style={styles.companyText}>{exp.company}</Text>
            <Text style={styles.dateText}>
              {exp.startDate} - {exp.endDate}
            </Text>
            <Text style={styles.descriptionText}>{exp.description}</Text>
          </View>
        ))}
      </CVDetailSection>

      <CVDetailSection title="Education">
        {selectedCV.education.map((edu, index) => (
          <View key={index} style={styles.educationItem}>
            <Text style={styles.degreeText}>
              {edu.degree} in {edu.field}
            </Text>
            <Text style={styles.institutionText}>{edu.institution}</Text>
            <Text style={styles.dateText}>
              {edu.startDate} - {edu.endDate}
            </Text>
          </View>
        ))}
      </CVDetailSection>

      <CVDetailSection title="Skills">
        <View style={styles.skillsContainer}>
          {selectedCV.skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill.name}</Text>
            </View>
          ))}
        </View>
      </CVDetailSection>

      {selectedCV.languages && selectedCV.languages.length > 0 && (
        <CVDetailSection title="Languages">
          <View style={styles.languagesContainer}>
            {selectedCV.languages.map((language, index) => (
              <Text key={index} style={styles.languageText}>
                {language}
                {index < selectedCV.languages!.length - 1 ? ', ' : ''}
              </Text>
            ))}
          </View>
        </CVDetailSection>
      )}

      {selectedCV.publications && selectedCV.publications.length > 0 && (
        <CVDetailSection title="Publications">
          {selectedCV.publications.map((publication, index) => (
            <Text key={index} style={styles.publicationText}>
              • {publication}
            </Text>
          ))}
        </CVDetailSection>
      )}

      <CVDetailSection title="Tags">
        <TagInput
          tags={selectedCV.tags || []}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          placeholder="Add a tag..."
        />
      </CVDetailSection>

      <View style={styles.metadataContainer}>
        <Text style={styles.metadataText}>
          Uploaded on {selectedCV.uploadDate}
        </Text>
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  header: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  summaryText: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
  },
  experienceItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  positionText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  companyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
  },
  educationItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  degreeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  institutionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray[700],
    marginBottom: 4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: colors.gray[700],
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageText: {
    fontSize: 16,
    color: colors.gray[700],
  },
  publicationText: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
    marginBottom: 8,
  },
  metadataContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  metadataText: {
    fontSize: 14,
    color: colors.gray[500],
    textAlign: 'center',
  },
});