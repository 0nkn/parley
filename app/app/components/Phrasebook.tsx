import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsVolumeUp, BsStar, BsStarFill, BsTrash, BsPencil, BsCheck, BsX, BsPlus } from 'react-icons/bs';
import { BiBook } from 'react-icons/bi';

interface Phrase {
  id: string;
  text: string;
  category: string;
  isFavorite: boolean;
}

export default function Phrasebook({ 
  onSelectPhrase 
}: { 
  onSelectPhrase: (phrase: string) => void 
}) {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPhraseText, setNewPhraseText] = useState('');
  const [newPhraseCategory, setNewPhraseCategory] = useState('');
  const [isAddingPhrase, setIsAddingPhrase] = useState(false);
  const [editingPhraseId, setEditingPhraseId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Load phrases from localStorage on component mount
  useEffect(() => {
    const savedPhrases = localStorage.getItem('userPhrases');
    if (savedPhrases) {
      setPhrases(JSON.parse(savedPhrases));
    } else {
      // Default phrases if none exist
      const defaultPhrases: Phrase[] = [
        { id: '1', text: 'Hello, how are you?', category: 'Greetings', isFavorite: false },
        { id: '2', text: 'I need help, please.', category: 'Help', isFavorite: true },
        { id: '3', text: 'Thank you very much.', category: 'Gratitude', isFavorite: false },
        { id: '4', text: 'Could you speak more slowly?', category: 'Communication', isFavorite: false },
        { id: '5', text: 'I don\'t understand.', category: 'Communication', isFavorite: false },
        { id: '6', text: 'What time is it?', category: 'Questions', isFavorite: false },
      ];
      setPhrases(defaultPhrases);
      localStorage.setItem('userPhrases', JSON.stringify(defaultPhrases));
    }
  }, []);

  // Extract unique categories whenever phrases change
  useEffect(() => {
    const uniqueCategories = [...new Set(phrases.map(phrase => phrase.category))];
    setCategories(uniqueCategories);
    
    // Save phrases to localStorage whenever they change
    localStorage.setItem('userPhrases', JSON.stringify(phrases));
  }, [phrases]);

  // Get filtered phrases based on selected category
  const getFilteredPhrases = () => {
    if (selectedCategory === 'all') {
      return phrases;
    } else if (selectedCategory === 'favorites') {
      return phrases.filter(phrase => phrase.isFavorite);
    } else {
      return phrases.filter(phrase => phrase.category === selectedCategory);
    }
  };

  const handlePhraseClick = (phrase: Phrase) => {
    onSelectPhrase(phrase.text);
    
    // Text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrase.text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleFavorite = (id: string) => {
    setPhrases(phrases.map(phrase => 
      phrase.id === id ? { ...phrase, isFavorite: !phrase.isFavorite } : phrase
    ));
  };

  const deletePhrase = (id: string) => {
    setPhrases(phrases.filter(phrase => phrase.id !== id));
  };

  const startEditing = (phrase: Phrase) => {
    setEditingPhraseId(phrase.id);
    setEditText(phrase.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setPhrases(phrases.map(phrase => 
        phrase.id === id ? { ...phrase, text: editText } : phrase
      ));
    }
    setEditingPhraseId(null);
  };

  const addNewPhrase = () => {
    if (newPhraseText.trim()) {
      const categoryToUse = newPhraseCategory || 'Uncategorized';
      
      const newPhrase: Phrase = {
        id: Date.now().toString(),
        text: newPhraseText,
        category: categoryToUse,
        isFavorite: false
      };
      
      setPhrases([...phrases, newPhrase]);
      setNewPhraseText('');
      setNewPhraseCategory('');
      setIsAddingPhrase(false);
      
      // Add category if it's new
      if (!categories.includes(categoryToUse) && categoryToUse !== 'Uncategorized') {
        setCategories([...categories, categoryToUse]);
      }
    }
  };

  const addCategory = () => {
    if (customCategory.trim() && !categories.includes(customCategory)) {
      setCategories([...categories, customCategory]);
      setNewPhraseCategory(customCategory);
      setCustomCategory('');
      setIsAddingCategory(false);
    }
  };

  const filteredPhrases = getFilteredPhrases();

  return (
    <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white gradient-text flex items-center">
          <BiBook className="mr-2 text-indigo-400" />
          Phrasebook
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingPhrase(!isAddingPhrase)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm flex items-center"
        >
          {isAddingPhrase ? <BsX className="mr-1" /> : <BsPlus className="mr-1" />}
          {isAddingPhrase ? 'Cancel' : 'Add Phrase'}
        </motion.button>
      </div>
      
      {/* Add new phrase form */}
      <AnimatePresence>
        {isAddingPhrase && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="glassmorphic p-3 rounded-lg">
              <textarea
                value={newPhraseText}
                onChange={(e) => setNewPhraseText(e.target.value)}
                placeholder="Enter your phrase..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-2"
                rows={2}
              />
              
              <div className="flex items-center">
                {isAddingCategory ? (
                  <div className="flex items-center mr-2 flex-1">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="New category name..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-1 px-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      onClick={addCategory}
                      className="ml-1 p-1 bg-green-600 rounded-md hover:bg-green-700"
                    >
                      <BsCheck className="text-white" />
                    </button>
                    <button
                      onClick={() => setIsAddingCategory(false)}
                      className="ml-1 p-1 bg-red-600 rounded-md hover:bg-red-700"
                    >
                      <BsX className="text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center flex-1">
                    <select
                      value={newPhraseCategory}
                      onChange={(e) => setNewPhraseCategory(e.target.value)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg py-1 px-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select category...</option>
                      <option value="Uncategorized">Uncategorized</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setIsAddingCategory(true)}
                      className="ml-1 p-1 bg-gray-700 rounded-md hover:bg-gray-600 text-white text-sm"
                    >
                      <BsPlus size={18} />
                    </button>
                  </div>
                )}
                
                <button
                  onClick={addNewPhrase}
                  disabled={!newPhraseText.trim()}
                  className={`ml-2 px-3 py-1 rounded-lg text-white text-sm ${
                    newPhraseText.trim() ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Category tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-lg text-sm ${
            selectedCategory === 'all' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          All
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedCategory('favorites')}
          className={`px-3 py-1 rounded-lg text-sm flex items-center ${
            selectedCategory === 'favorites' 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <BsStarFill className="mr-1 text-yellow-400" />
          Favorites
        </motion.button>
        
        {categories.map(category => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedCategory === category 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
      
      {/* Phrases list */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
        {filteredPhrases.length > 0 ? (
          filteredPhrases.map(phrase => (
            <motion.div
              key={phrase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glassmorphic rounded-lg p-3 hover:border-indigo-500 border border-transparent transition-colors"
            >
              {editingPhraseId === phrase.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none mb-2"
                    rows={2}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => saveEdit(phrase.id)}
                      className="p-1 bg-green-600 rounded-md hover:bg-green-700 text-white"
                    >
                      <BsCheck />
                    </button>
                    <button
                      onClick={() => setEditingPhraseId(null)}
                      className="p-1 bg-red-600 rounded-md hover:bg-red-700 text-white"
                    >
                      <BsX />
                    </button>
                  </div>
                </div>
              ) : (
                <div onClick={() => handlePhraseClick(phrase)} className="cursor-pointer">
                  <p className="text-white mb-1">{phrase.text}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                      {phrase.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(phrase.text);
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                        className="text-gray-400 hover:text-indigo-400 transition-colors"
                        aria-label="Speak phrase"
                      >
                        <BsVolumeUp />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(phrase.id);
                        }}
                        className={`${phrase.isFavorite ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                        aria-label={phrase.isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {phrase.isFavorite ? <BsStarFill /> : <BsStar />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(phrase);
                        }}
                        className="text-gray-400 hover:text-indigo-400 transition-colors"
                        aria-label="Edit phrase"
                      >
                        <BsPencil />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePhrase(phrase.id);
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        aria-label="Delete phrase"
                      >
                        <BsTrash />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No phrases found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
} 