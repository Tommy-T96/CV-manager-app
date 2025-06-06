import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { CV } from '@/types/cv';
import { colors } from '@/constants/colors';
import { FileText } from 'lucide-react-native';

interface CVCardProps {
  cv: CV;
  onSelect: () => void;
}

export const CVCard: React.FC<CVCardProps> = ({ cv, onSelect }) => {
  const router = useRouter();
  
  const handlePress = () => {
    onSelect();
    router.push(`/cv/${cv.id}`);
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.iconContainer}>
        <FileText size={24} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{cv.name}</Text>
        <Text style={styles.email}>{cv.email}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detail}>
            {cv.experience[0]?.position || 'No position'} • {cv.experience[0]?.company || 'No company'}
          </Text>
        </View>
        <View style={styles.skillsContainer}>
          {cv.skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill.name}</Text>
            </View>
          ))}
          {cv.skills.length > 3 && (
            <Text style={styles.moreSkills}>+{cv.skills.length - 3} more</Text>
          )}
        </View>
        {cv.tags && cv.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {cv.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {cv.tags.length > 3 && (
              <Text style={styles.moreTags}>+{cv.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: colors.gray[50],
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: colors.lightText,
    marginBottom: 8,
  },
  detailsRow: {
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    color: colors.gray[600],
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  skillBadge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: colors.gray[700],
  },
  moreSkills: {
    fontSize: 12,
    color: colors.gray[500],
    alignSelf: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
  },
  moreTags: {
    fontSize: 12,
    color: colors.gray[500],
    alignSelf: 'center',
  },
});