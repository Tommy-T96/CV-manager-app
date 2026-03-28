import { CV, CVSearchResult } from '@/types/cv';

// This is a mock implementation of a natural language query processor
// In a real app, you would use a more sophisticated approach, possibly with embeddings or NLP
export const processNaturalLanguageQuery = async (query: string, cvs: CV[]): Promise<CVSearchResult[]> => {
  // Convert query to lowercase for case-insensitive matching
  const lowercaseQuery = query.toLowerCase();
  
  // Define some patterns to match common query types
  const patterns = [
    {
      regex: /who has experience with (.*?)\??$/i,
      field: 'experience',
      extractTerm: (match: RegExpMatchArray) => match[1],
    },
    {
      regex: /who knows (.*?)\??$/i,
      field: 'skills',
      extractTerm: (match: RegExpMatchArray) => match[1],
    },
    {
      regex: /list all candidates with (.*?) experience/i,
      field: 'experience',
      extractTerm: (match: RegExpMatchArray) => match[1],
    },
    {
      regex: /which cvs mention (.*?)\??$/i,
      field: 'all',
      extractTerm: (match: RegExpMatchArray) => match[1],
    },
    {
      regex: /find people who studied (.*?)\??$/i,
      field: 'education',
      extractTerm: (match: RegExpMatchArray) => match[1],
    },
    {
      regex: /who worked at (.*?)\??$/i,
      field: 'experience',
      extractTerm: (match: RegExpMatchArray) => match[1],
    },
  ];
  
  // Try to match the query against patterns
  let matchedPattern = null;
  let searchTerm = '';
  
  for (const pattern of patterns) {
    const match = lowercaseQuery.match(pattern.regex);
    if (match) {
      matchedPattern = pattern;
      searchTerm = pattern.extractTerm(match).toLowerCase();
      break;
    }
  }
  
  // If no pattern matched, use the whole query as a general search term
  if (!matchedPattern) {
    matchedPattern = { field: 'all', extractTerm: () => lowercaseQuery };
    searchTerm = lowercaseQuery;
  }
  
  // Search CVs based on the matched pattern and search term
  const results: CVSearchResult[] = cvs.map(cv => {
    const matchedFields: string[] = [];
    let relevanceScore = 0;
    
    const searchInField = (fieldName: string, fieldValue: any) => {
      if (typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(searchTerm)) {
        matchedFields.push(fieldName);
        relevanceScore += 5;
        return true;
      }
      return false;
    };
    
    const searchInArray = (fieldName: string, array: any[], property?: string) => {
      const matches = array.filter(item => {
        if (property) {
          return typeof item[property] === 'string' && item[property].toLowerCase().includes(searchTerm);
        }
        return typeof item === 'string' && item.toLowerCase().includes(searchTerm);
      });
      
      if (matches.length > 0) {
        matchedFields.push(fieldName);
        relevanceScore += matches.length * 3;
        return true;
      }
      return false;
    };
    
    if (matchedPattern.field === 'all' || matchedPattern.field === 'skills') {
      searchInArray('skills', cv.skills, 'name');
    }
    
    if (matchedPattern.field === 'all' || matchedPattern.field === 'experience') {
      const expMatches = cv.experience.filter(exp => 
        exp.company.toLowerCase().includes(searchTerm) || 
        exp.position.toLowerCase().includes(searchTerm) || 
        exp.description.toLowerCase().includes(searchTerm)
      );
      
      if (expMatches.length > 0) {
        matchedFields.push('experience');
        relevanceScore += expMatches.length * 4;
      }
    }
    
    if (matchedPattern.field === 'all' || matchedPattern.field === 'education') {
      const eduMatches = cv.education.filter(edu => 
        edu.institution.toLowerCase().includes(searchTerm) || 
        edu.degree.toLowerCase().includes(searchTerm) || 
        edu.field.toLowerCase().includes(searchTerm)
      );
      
      if (eduMatches.length > 0) {
        matchedFields.push('education');
        relevanceScore += eduMatches.length * 4;
      }
    }
    
    if (matchedPattern.field === 'all') {
      searchInField('name', cv.name);
      searchInField('email', cv.email);
      searchInField('summary', cv.summary || '');
      
      if (cv.publications) {
        searchInArray('publications', cv.publications);
      }
      
      if (cv.tags) {
        searchInArray('tags', cv.tags);
      }
    }
    
    return { cv, relevanceScore, matchedFields };
  }).filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return results;
};

// Function to generate a response to a natural language query
export const generateQueryResponse = async (query: string, results: CVSearchResult[]): Promise<string> => {
  if (results.length === 0) {
    return "I couldn't find any CVs matching your query. Try a different search term or check if the information you're looking for is available in the database.";
  }
  
  // Simulate thinking time
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const lowercaseQuery = query.toLowerCase();
  
  // Generate different responses based on query patterns
  if (lowercaseQuery.includes('who has experience with') || lowercaseQuery.includes('who knows')) {
    const names = results.map(r => r.cv.name).join(', ');
    return `I found ${results.length} people with relevant experience: ${names}. You can view their detailed profiles for more information.`;
  }
  
  if (lowercaseQuery.includes('list all candidates')) {
    return `Here are ${results.length} candidates matching your criteria:\n\n${results.map((r, i) => `${i+1}. ${r.cv.name} - ${r.cv.experience[0]?.position || 'No position'} at ${r.cv.experience[0]?.company || 'No company'}`).join('\n')}`;
  }
  
  if (lowercaseQuery.includes('which cvs mention')) {
    return `I found ${results.length} CVs mentioning your search term. The most relevant ones are from ${results.slice(0, 3).map(r => r.cv.name).join(', ')}.`;
  }
  
  // Default response
  return `I found ${results.length} results matching your query. The top matches are from ${results.slice(0, 3).map(r => r.cv.name).join(', ')}. You can view their detailed profiles for more information.`;
};