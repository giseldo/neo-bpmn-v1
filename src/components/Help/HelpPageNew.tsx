import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, HelpCircle, Lightbulb, Zap, Users } from 'lucide-react';

interface HelpPageProps {
  onClose: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-3">
            <HelpCircle size={32} />
            <h1 className="text-3xl font-bold">{t('help.title')}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Getting Started */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">{t('help.gettingStarted')}</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {t('help.gettingStartedText')}
              </p>
            </div>
          </section>

          {/* BPMN Elements */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">{t('help.elements')}</h2>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {t('help.elementsText')}
              </p>
            </div>
          </section>

          {/* AI Assistant */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-purple-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">{t('help.aiAssistant')}</h2>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed">
                {t('help.aiAssistantText')}
              </p>
            </div>
          </section>

          {/* Close Button */}
          <div className="text-center pt-4">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('help.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
