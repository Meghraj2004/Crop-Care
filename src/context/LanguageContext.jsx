import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { TRANSLATIONS } from './translationsData';

export { TRANSLATIONS };

const LanguageContext = createContext(null);

// Build an inverse lookup map for English text to translation key
const englishToKeyMap = {};
Object.entries(TRANSLATIONS.English || {}).forEach(([key, value]) => {
  if (typeof value === 'string') {
    englishToKeyMap[value.trim().toLowerCase()] = key;
    englishToKeyMap[value.trim()] = key;
  }
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('farmconnect_lang') || 'English';
  });

  const changeLanguage = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('farmconnect_lang', newLang);
  };

  /**
   * Smart Translation Function:
   * 1. Looks up translation key directly in TRANSLATIONS[language][key]
   * 2. If not found as a key, checks if the input is an English phrase in our dictionary
   * 3. Fallbacks cleanly to defaultText or key/original text
   */
  const t = (keyOrText, defaultText = null) => {
    if (!keyOrText) return '';
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS['English'];

    // 1. Direct Key match
    if (currentDict && currentDict[keyOrText] !== undefined) {
      return currentDict[keyOrText];
    }

    // 2. Exact English phrase match in our map
    const mappedKey = englishToKeyMap[keyOrText] || englishToKeyMap[String(keyOrText).trim().toLowerCase()];
    if (mappedKey && currentDict && currentDict[mappedKey] !== undefined) {
      return currentDict[mappedKey];
    }

    // 3. Fallback to English dictionary or default text or original string
    return defaultText || TRANSLATIONS['English']?.[keyOrText] || keyOrText;
  };

  /**
   * Global Deep DOM Auto-Translator:
   * Automatically scans rendered text nodes in the page and replaces matching English phrases
   * with current language translations (Marathi/Hindi).
   * Restores original text when English is selected.
   */
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Set document lang attribute
    document.documentElement.lang = language === 'Marathi' ? 'mr' : language === 'Hindi' ? 'hi' : 'en';

    if (language === 'English') {
      // Revert any auto-translated nodes back to original English text
      const elements = document.querySelectorAll('[data-fc-orig]');
      elements.forEach(el => {
        if (el.getAttribute('data-fc-orig')) {
          el.textContent = el.getAttribute('data-fc-orig');
          el.removeAttribute('data-fc-orig');
        }
      });
      return;
    }

    // Target dictionary for current language
    const currentDict = TRANSLATIONS[language];
    if (!currentDict) return;

    // Create an array of sorted English phrases (longest first to avoid partial collision)
    const phraseEntries = Object.entries(TRANSLATIONS.English)
      .filter(([k, val]) => typeof val === 'string' && val.length > 2 && currentDict[k])
      .map(([k, val]) => ({
        key: k,
        en: val.trim(),
        target: currentDict[k]
      }))
      .sort((a, b) => b.en.length - a.en.length);

    const translateNode = (node) => {
      // Skip script, style, textarea, input, code tags
      if (!node || !node.parentElement) return;
      const tag = node.parentElement.tagName.toLowerCase();
      if (['script', 'style', 'noscript', 'code', 'pre'].includes(tag)) return;

      const text = node.textContent;
      if (!text || !text.trim() || text.length < 2) return;

      const trimmed = text.trim();

      // Check for exact match first
      const mappedKey = englishToKeyMap[trimmed] || englishToKeyMap[trimmed.toLowerCase()];
      if (mappedKey && currentDict[mappedKey]) {
        const parent = node.parentElement;
        if (!parent.hasAttribute('data-fc-orig')) {
          parent.setAttribute('data-fc-orig', text);
        }
        node.textContent = text.replace(trimmed, currentDict[mappedKey]);
        return;
      }

      // Check phrase replacements
      let updatedText = text;
      let replaced = false;

      for (const item of phraseEntries) {
        if (updatedText.includes(item.en)) {
          updatedText = updatedText.replaceAll(item.en, item.target);
          replaced = true;
        }
      }

      if (replaced) {
        const parent = node.parentElement;
        if (!parent.hasAttribute('data-fc-orig')) {
          parent.setAttribute('data-fc-orig', text);
        }
        node.textContent = updatedText;
      }
    };

    const walkTextNodes = (root) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
      let currentNode = walker.nextNode();
      while (currentNode) {
        translateNode(currentNode);
        currentNode = walker.nextNode();
      }
    };

    // Run initial translation pass
    walkTextNodes(document.body);

    // Watch for dynamic DOM changes (e.g. route transitions, new cards, open modals)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            translateNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            walkTextNodes(node);
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translations: TRANSLATIONS[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};
