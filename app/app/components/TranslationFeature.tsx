import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BsArrowLeftRight, BsVolumeUp, BsCopy, BsCheck } from 'react-icons/bs';
import { MdOutlineLanguage } from 'react-icons/md';

interface Language {
  code: string;
  name: string;
}

export default function TranslationFeature() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [recentLanguages, setRecentLanguages] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ur', name: 'Urdu' },
    { code: 'tr', name: 'Turkish' },
    { code: 'vi', name: 'Vietnamese' },
    { code: 'th', name: 'Thai' },
  ];

  // Load recent languages from localStorage
  useEffect(() => {
    const savedRecentLanguages = localStorage.getItem('recentLanguages');
    if (savedRecentLanguages) {
      setRecentLanguages(JSON.parse(savedRecentLanguages));
    }
  }, []);

  // Update recent languages
  const updateRecentLanguages = (langCode: string) => {
    if (recentLanguages.includes(langCode)) {
      const updatedRecents = [
        langCode,
        ...recentLanguages.filter(code => code !== langCode)
      ];
      setRecentLanguages(updatedRecents.slice(0, 3));
    } else {
      const updatedRecents = [langCode, ...recentLanguages].slice(0, 3);
      setRecentLanguages(updatedRecents);
    }
    
    localStorage.setItem('recentLanguages', JSON.stringify(recentLanguages));
  };

  // Mock translation function (in a real app, this would call a translation API)
  const translateText = () => {
    if (!inputText.trim()) {
      setTranslatedText('');
      return;
    }
    
    setIsTranslating(true);
    
    // This simulates an API call - in a real app, you'd call a translation service
    setTimeout(() => {
      // Simple mock translations for demo purposes
      const mockTranslations: Record<string, Record<string, string>> = {
        en: {
          es: 'Texto traducido al español',
          fr: 'Texte traduit en français',
          de: 'Text ins Deutsche übersetzt'
        },
        es: {
          en: 'Text translated to English',
          fr: 'Texte traduit en français',
          de: 'Text ins Deutsche übersetzt'
        },
        fr: {
          en: 'Text translated to English',
          es: 'Texto traducido al español',
          de: 'Text ins Deutsche übersetzt'
        },
        de: {
          en: 'Text translated to English',
          es: 'Texto traducido al español',
          fr: 'Texte traduit en français'
        }
      };
      
      const translation = mockTranslations[sourceLanguage]?.[targetLanguage] || 
        `Translation from ${getLanguageName(sourceLanguage)} to ${getLanguageName(targetLanguage)}: "${inputText}"`;
      
      setTranslatedText(translation);
      setIsTranslating(false);
      
      updateRecentLanguages(targetLanguage);
    }, 800);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      translateText();
    }, 500);
    
    return () => clearTimeout(debounceTimeout);
  }, [inputText, sourceLanguage, targetLanguage]);

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const getLanguageName = (code: string): string => {
    return languages.find(lang => lang.code === code)?.name || code;
  };

  const speakText = (text: string, langCode: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4 gradient-text flex items-center">
        <MdOutlineLanguage className="mr-2 text-indigo-400" />
        Real-Time Translation
      </h3>
      
      {/* Language selector */}
      <div className="flex items-center justify-between mb-4">
        <select
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-[calc(50%-40px)]"
        >
          {languages.map(lang => (
            <option key={`source-${lang.code}`} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={swapLanguages}
          className="mx-2 p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
          aria-label="Swap languages"
        >
          <BsArrowLeftRight className="text-white" />
        </motion.button>
        
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-[calc(50%-40px)]"
        >
          {recentLanguages.length > 0 && (
            <optgroup label="Recent">
              {recentLanguages.map(code => (
                <option key={`recent-${code}`} value={code}>
                  {getLanguageName(code)}
                </option>
              ))}
            </optgroup>
          )}
          <optgroup label="All Languages">
            {languages.map(lang => (
              <option key={`target-${lang.code}`} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      
      {/* Input textarea */}
      <div className="mb-4">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type text in ${getLanguageName(sourceLanguage)}...`}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
        />
        
        <div className="flex justify-end mt-1">
          <button
            onClick={() => speakText(inputText, sourceLanguage)}
            disabled={!inputText}
            className={`text-sm flex items-center p-1.5 rounded ${
              !inputText ? 'text-gray-600' : 'text-gray-400 hover:text-indigo-400 hover:bg-gray-800'
            }`}
            aria-label="Speak source text"
          >
            <BsVolumeUp className="mr-1" /> Listen
          </button>
        </div>
      </div>
      
      {/* Output area */}
      <div className="relative">
        <div className={`w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 min-h-[80px] text-white ${
          isTranslating ? 'opacity-50' : ''
        }`}>
          {isTranslating ? (
            <div className="flex items-center justify-center h-full">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <p>{translatedText}</p>
          )}
        </div>
        
        {translatedText && !isTranslating && (
          <div className="flex justify-end mt-1">
            <button
              onClick={() => speakText(translatedText, targetLanguage)}
              className="text-sm flex items-center p-1.5 rounded text-gray-400 hover:text-indigo-400 hover:bg-gray-800 mr-2"
              aria-label="Speak translated text"
            >
              <BsVolumeUp className="mr-1" /> Listen
            </button>
            
            <button
              onClick={() => copyToClipboard(translatedText)}
              className="text-sm flex items-center p-1.5 rounded text-gray-400 hover:text-indigo-400 hover:bg-gray-800"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <>
                  <BsCheck className="mr-1" /> Copied
                </>
              ) : (
                <>
                  <BsCopy className="mr-1" /> Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 