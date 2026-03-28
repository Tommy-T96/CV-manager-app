import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { useCVStore } from '@/hooks/useCVStore';
import { CVCard } from '@/components/CVCard';
import { EmptyState } from '@/components/EmptyState';
import { SearchBar } from '@/components/SearchBar';
import { colors } from '@/constants/colors';
import { FileText, Plus } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';

export default function CVListScreen() {
  const router = useRouter();
  const { 
    cvs, 
    searchQuery, 
    searchResults, 
    setSearchQuery, 
    searchCVs, 
    selectCV 
  } = useCVStore();
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchCVs(searchQuery);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleSelectCV = (id: string) => {
    selectCV(id);
  };
  
  const handleUploadCV = () => {
    router.push('/upload');
  };
  
  const displayedCVs = searchQuery.trim() ? searchResults.map(result => result.cv) : cvs;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={handleSearch}
          placeholder="Search CVs by name, skills, etc."
        />
        <Button
          title="Upload CV"
          onPress={handleUploadCV}
          icon={<Plus size={16} color={colors.white} />}
        />
      </View>
      
      {displayedCVs.length > 0 ? (
        <FlatList
          data={displayedCVs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CVCard 
              cv={item} 
              onSelect={() => handleSelectCV(item.id)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            searchQuery.trim() ? (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsText}>
                  {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                </Text>
                <Button
                  title="Clear"
                  onPress={handleClearSearch}
                  variant="outline"
                  size="small"
                />
              </View>
            ) : null
          }
        />
      ) : (
        <EmptyState
          title="No CVs Found"
          description={
            searchQuery.trim()
              ? `No CVs match your search for "${searchQuery}". Try a different search term.`
              : "You haven't uploaded any CVs yet. Start by uploading your first CV."
          }
          actionLabel={searchQuery.trim() ? "Clear Search" : "Upload CV"}
          onAction={searchQuery.trim() ? handleClearSearch : handleUploadCV}
          icon={<FileText size={64} color={colors.gray[300]} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  listContent: {
    padding: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: colors.gray[600],
  },
});