import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
        <Globe className="w-4 h-4" />
        {t('sidebar.language')}
      </button>
      
      <div className="absolute left-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
        <button
          onClick={() => changeLanguage('en')}
          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
            i18n.language === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
          }`}
        >
          {t('languages.en')}
        </button>
        <button
          onClick={() => changeLanguage('pt')}
          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
            i18n.language === 'pt' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
          }`}
        >
          {t('languages.pt')}
        </button>
      </div>
    </div>
  );
}
