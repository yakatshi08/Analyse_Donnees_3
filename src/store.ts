import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  // Mode sombre
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Langue
  language: 'fr' | 'en' | 'de' | 'es' | 'it' | 'pt';
  setLanguage: (language: 'fr' | 'en' | 'de' | 'es' | 'it' | 'pt') => void;
  
  // Profil utilisateur
  selectedProfile: string;
  setSelectedProfile: (profile: string) => void;
  
  // Secteur sélectionné
  selectedSector: 'all' | 'banking' | 'insurance';
  setSelectedSector: (sector: 'all' | 'banking' | 'insurance') => void;
  
  // Module actif
  activeModule: string;
  setActiveModule: (module: string) => void;
  
  // Données Dashboard existantes (préservées)
  kpis: any[];
  charts: any[];
  
  // Filtres et préférences
  dateRange: { start: Date; end: Date };
  setDateRange: (range: { start: Date; end: Date }) => void;
  
  // Notifications
  notifications: any[];
  addNotification: (notification: any) => void;
  removeNotification: (id: string) => void;
  
  // État de chargement
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Valeurs par défaut
      darkMode: false,
      language: 'fr',
      selectedProfile: 'banker',
      selectedSector: 'all',
      activeModule: 'dashboard',
      kpis: [],
      charts: [],
      dateRange: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        end: new Date()
      },
      notifications: [],
      isLoading: false,
      
      // Actions
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      setLanguage: (language) => set({ language }),
      
      setSelectedProfile: (profile) => set({ selectedProfile: profile }),
      
      setSelectedSector: (sector) => set({ selectedSector: sector }),
      
      setActiveModule: (module) => set({ activeModule: module }),
      
      setDateRange: (range) => set({ dateRange: range }),
      
      addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, { 
          id: Date.now().toString(), 
          timestamp: new Date(),
          ...notification 
        }]
      })),
      
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
      
      setIsLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'pi-bicars-storage', // Nom du localStorage
      partialize: (state) => ({
        darkMode: state.darkMode,
        language: state.language,
        selectedProfile: state.selectedProfile,
        selectedSector: state.selectedSector,
        dateRange: state.dateRange
      })
    }
  )
);