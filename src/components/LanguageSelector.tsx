import React from 'react';
import { Globe } from 'lucide-react';
import { useStore } from '../store';

export const LanguageSelector: React.FC = () => {
  const { darkMode, language, setLanguage } = useStore();

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', label: 'Português', flag: '🇵🇹' }
  ];

  return (
    <div className="relative group">
      <button className={`flex items-center space-x-2 px-3 py-2 rounded-lg
        ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}>
        <Globe className="h-5 w-5" />
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {languages.find(l => l.code === language)?.flag} {language.toUpperCase()}
        </span>
      </button>
      
      {/* Dropdown Langues */}
      <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg 
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
        border opacity-0 invisible group-hover:opacity-100 group-hover:visible 
        transition-all duration-200 z-50`}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2
              ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}
              ${language === lang.code ? 'font-semibold bg-opacity-50' : ''}`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};