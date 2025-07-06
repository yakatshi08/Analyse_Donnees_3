// Système de traduction pour PI BICARS
export const translations = {
  fr: {
    // ... autres traductions
    
    // Navigation
    nav: {
      dashboard: 'Tableau de bord',
      import: 'Import de données',
      bankingCore: 'Module Bancaire',
      insuranceCore: 'Module Assurance',
      coPilot: 'Co-Pilot IA',
      analytics: 'Analyses',
      risk: 'Gestion des Risques',
      reports: 'Rapports',
      settings: 'Paramètres',
      analyticsML: 'Analytics ML', // AJOUT
      creditRisk: 'Risque de Crédit' // AJOUT
    },
    
    // ... autres traductions
  },
  
  en: {
    // ... autres traductions
    
    nav: {
      dashboard: 'Dashboard',
      import: 'Data Import',
      bankingCore: 'Banking Core',
      insuranceCore: 'Insurance Core',
      coPilot: 'Co-Pilot AI',
      analytics: 'Analytics',
      risk: 'Risk Management',
      reports: 'Reports',
      settings: 'Settings',
      analyticsML: 'Analytics ML', // AJOUT
      creditRisk: 'Credit Risk' // AJOUT
    },
    
    // ... autres traductions
  },
  
  de: {
    // ... autres traductions
    
    nav: {
      dashboard: 'Dashboard',
      import: 'Datenimport',
      bankingCore: 'Banking-Modul',
      insuranceCore: 'Versicherungsmodul',
      coPilot: 'Co-Pilot KI',
      analytics: 'Analysen',
      risk: 'Risikomanagement',
      reports: 'Berichte',
      settings: 'Einstellungen',
      analyticsML: 'Analytics ML', // AJOUT
      creditRisk: 'Kreditrisiko' // AJOUT
    },
    
    // ... autres traductions
  },
  
  es: {
    // ... autres traductions
    
    nav: {
      dashboard: 'Panel de Control',
      import: 'Importar Datos',
      bankingCore: 'Módulo Bancario',
      insuranceCore: 'Módulo de Seguros',
      coPilot: 'Co-Pilot IA',
      analytics: 'Análisis',
      risk: 'Gestión de Riesgos',
      reports: 'Informes',
      settings: 'Configuración',
      analyticsML: 'Analytics ML', // AJOUT
      creditRisk: 'Riesgo Crediticio' // AJOUT
    },
    
    // ... autres traductions
  },
  
  it: {
    // ... autres traductions
    
    nav: {
      dashboard: 'Cruscotto',
      import: 'Importa Dati',
      bankingCore: 'Modulo Bancario',
      insuranceCore: 'Modulo Assicurativo',
      coPilot: 'Co-Pilot IA',
      analytics: 'Analisi',
      risk: 'Gestione Rischi',
      reports: 'Rapporti',
      settings: 'Impostazioni',
      analyticsML: 'Analytics ML', // AJOUT
      creditRisk: 'Rischio di Credito' // AJOUT
    },
    
    // ... autres traductions
  },
  
  pt: {
    // ... autres traductions
    
    nav: {
      dashboard: 'Painel de Controle',
      import: 'Importar Dados',
      bankingCore: 'Módulo Bancário',
      insuranceCore: 'Módulo de Seguros',
      coPilot: 'Co-Pilot IA',
      analytics: 'Análises',
      risk: 'Gestão de Riscos',
      reports: 'Relatórios',
      settings: 'Configurações',
      analyticsML: 'Analytics ML', // AJOUT
      creditRisk: 'Risco de Crédito' // AJOUT
    },
    
    // ... autres traductions
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.fr;