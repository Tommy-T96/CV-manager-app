import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from 'react-native';
import { useCVStore } from '@/hooks/useCVStore';
import { QueryInput } from '@/components/QueryInput';
import { CVCard } from '@/components/CVCard';
import { EmptyState } from '@/components/EmptyState';
import { colors } from '@/constants/colors';
import { processNaturalLanguageQuery, generateQueryResponse } from '@/utils/queryUtils';
import { CVSearchResult } from '@/types/cv';
import { Search as SearchIcon } from 'lucide-react-native';

export default function SearchScreen() {
  const { cvs, selectCV } = useCVStore();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CVSearchResult[]>([]);
  const [response, setResponse] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleQuerySubmit = async (queryText: string) => {
    setQuery(queryText);
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Process the natural language query
      const searchResults = await processNaturalLanguageQuery(queryText, cvs);
      setResults(searchResults);
      
      // Generate a response
      const responseText = await generateQueryResponse(queryText, searchResults);
      setResponse(responseText);
    } catch (error) {
      console.error('Error processing query:', error);
      setResponse('Sorry, I encountered an error while processing your query. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectCV = (id: string) => {
    selectCV(id);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {hasSearched ? (
          <>
            <View style={styles.responseContainer}>
              <Text style={styles.queryText}>"{query}"</Text>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.loadingText}>Processing your query...</Text>
                </View>
              ) : (
                <Text style={styles.responseText}>{response}</Text>
              )}
            </View>
            
            {results.length > 0 && !isLoading && (
              <View style={styles.resultsContainer}>
                <Text style={styles.resultsTitle}>Matching CVs</Text>
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.cv.id}
                  renderItem={({ item }) => (
                    <CVCard 
                      cv={item.cv} 
                      onSelect={() => handleSelectCV(item.cv.id)} 
                    />
                  )}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}
          </>
        ) : (
          <EmptyState
            title="Ask Questions About CVs"
            description="Ask natural language questions like 'Who has experience with qualitative research?' or 'List all candidates with teaching experience.'"
            icon={<SearchIcon size={64} color={colors.gray[300]} />}
          />
        )}
      </View>
      
      <View style={styles.inputContainer}>
        <QueryInput
          onSubmit={handleQuerySubmit}
          isLoading={isLoading}
          placeholder="Ask a question about the CVs..."
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  responseContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  queryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  responseText: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.gray[600],
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    paddingTop: 8,
    backgroundColor: colors.white,
  },
});