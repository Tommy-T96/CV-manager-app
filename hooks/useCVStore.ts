import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CV, CVSearchResult } from '@/types/cv';
import { mockCVs } from '@/mocks/cvs';

interface CVState {
  cvs: CV[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  searchResults: CVSearchResult[];
  selectedCV: CV | null;
  
  // Actions
  addCV: (cv: CV) => void;
  updateCV: (id: string, cv: Partial<CV>) => void;
  deleteCV: (id: string) => void;
  setSearchQuery: (query: string) => void;
  searchCVs: (query: string) => void;
  selectCV: (id: string | null) => void;
  addTagToCV: (cvId: string, tag: string) => void;
  removeTagFromCV: (cvId: string, tag: string) => void;
  resetError: () => void;
}

export const useCVStore = create<CVState>()(
  persist(
    (set, get) => ({
      cvs: mockCVs,
      isLoading: false,
      error: null,
      searchQuery: '',
      searchResults: [],
      selectedCV: null,

      addCV: (cv) => {
        set((state) => ({
          cvs: [...state.cvs, cv],
        }));
      },

      updateCV: (id, updatedCV) => {
        set((state) => ({
          cvs: state.cvs.map((cv) => 
            cv.id === id ? { ...cv, ...updatedCV } : cv
          ),
        }));
      },

      deleteCV: (id) => {
        set((state) => ({
          cvs: state.cvs.filter((cv) => cv.id !== id),
          selectedCV: state.selectedCV?.id === id ? null : state.selectedCV,
        }));
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      searchCVs: (query) => {
        set({ isLoading: true, error: null });
        
        try {
          const { cvs } = get();
          const lowercaseQuery = query.toLowerCase();
          
          // Simple search implementation
          const results: CVSearchResult[] = cvs
            .map(cv => {
              const matchedFields: string[] = [];
              let relevanceScore = 0;
              
              // Search in name
              if (cv.name.toLowerCase().includes(lowercaseQuery)) {
                matchedFields.push('name');
                relevanceScore += 10;
              }
              
              // Search in skills
              const matchedSkills = cv.skills.filter(skill => 
                skill.name.toLowerCase().includes(lowercaseQuery)
              );
              if (matchedSkills.length > 0) {
                matchedFields.push('skills');
                relevanceScore += matchedSkills.length * 5;
              }
              
              // Search in experience
              const matchedExperience = cv.experience.filter(exp => 
                exp.company.toLowerCase().includes(lowercaseQuery) || 
                exp.position.toLowerCase().includes(lowercaseQuery) || 
                exp.description.toLowerCase().includes(lowercaseQuery)
              );
              if (matchedExperience.length > 0) {
                matchedFields.push('experience');
                relevanceScore += matchedExperience.length * 3;
              }
              
              // Search in education
              const matchedEducation = cv.education.filter(edu => 
                edu.institution.toLowerCase().includes(lowercaseQuery) || 
                edu.degree.toLowerCase().includes(lowercaseQuery) || 
                edu.field.toLowerCase().includes(lowercaseQuery)
              );
              if (matchedEducation.length > 0) {
                matchedFields.push('education');
                relevanceScore += matchedEducation.length * 3;
              }
              
              // Search in summary
              if (cv.summary && cv.summary.toLowerCase().includes(lowercaseQuery)) {
                matchedFields.push('summary');
                relevanceScore += 2;
              }
              
              // Search in tags
              if (cv.tags && cv.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))) {
                matchedFields.push('tags');
                relevanceScore += 4;
              }
              
              return { cv, relevanceScore, matchedFields };
            })
            .filter(result => result.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore);
          
          set({ 
            searchResults: results,
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: "Failed to search CVs", 
            isLoading: false 
          });
        }
      },

      selectCV: (id) => {
        if (!id) {
          set({ selectedCV: null });
          return;
        }
        
        const { cvs } = get();
        const cv = cvs.find(cv => cv.id === id) || null;
        set({ selectedCV: cv });
      },

      addTagToCV: (cvId, tag) => {
        set((state) => ({
          cvs: state.cvs.map((cv) => {
            if (cv.id === cvId) {
              const tags = cv.tags || [];
              if (!tags.includes(tag)) {
                return { ...cv, tags: [...tags, tag] };
              }
            }
            return cv;
          }),
        }));
      },

      removeTagFromCV: (cvId, tag) => {
        set((state) => ({
          cvs: state.cvs.map((cv) => {
            if (cv.id === cvId && cv.tags) {
              return { ...cv, tags: cv.tags.filter(t => t !== tag) };
            }
            return cv;
          }),
        }));
      },

      resetError: () => set({ error: null }),
    }),
    {
      name: 'cv-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);