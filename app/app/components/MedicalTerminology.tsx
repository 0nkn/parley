import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BsSearch, BsVolumeUp, BsStarFill, BsStar } from 'react-icons/bs';
import { FaHeartbeat } from 'react-icons/fa';

interface MedicalTerm {
  id: string;
  term: string;
  definition: string;
  simplified: string;
  category: string;
}

export default function MedicalTerminology() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicalTerms, setMedicalTerms] = useState<MedicalTerm[]>([]);
  const [filteredTerms, setFilteredTerms] = useState<MedicalTerm[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');

  // Initialize medical terms
  useEffect(() => {
    // This would typically come from an API
    const terms: MedicalTerm[] = [
      {
        id: '1',
        term: 'Hypertension',
        definition: 'A condition in which the force of the blood against the artery walls is too high. Also known as high blood pressure.',
        simplified: 'High blood pressure that can lead to health problems.',
        category: 'Cardiovascular'
      },
      {
        id: '2',
        term: 'Myocardial Infarction',
        definition: 'The death of heart muscle due to the loss of blood supply, commonly known as a heart attack.',
        simplified: 'Heart attack - when blood can\'t get to part of your heart.',
        category: 'Cardiovascular'
      },
      {
        id: '3',
        term: 'Diabetes Mellitus',
        definition: 'A group of metabolic disorders characterized by high blood sugar levels over a prolonged period.',
        simplified: 'A condition where your body has trouble controlling blood sugar levels.',
        category: 'Endocrine'
      },
      {
        id: '4',
        term: 'Pneumonia',
        definition: 'Inflammation of the tissue in one or both lungs, usually caused by a bacterial infection.',
        simplified: 'An infection that inflames the air sacs in your lungs.',
        category: 'Respiratory'
      },
      {
        id: '5',
        term: 'Cerebrovascular Accident',
        definition: 'When blood flow to a part of the brain is stopped, either by a blockage or the rupture of a blood vessel. Also known as a stroke.',
        simplified: 'A stroke - when blood flow to part of the brain is blocked or a blood vessel bursts.',
        category: 'Neurological'
      },
      {
        id: '6',
        term: 'Osteoarthritis',
        definition: 'A type of joint disease that results from breakdown of joint cartilage and underlying bone.',
        simplified: 'Wear and tear on joints that causes pain and stiffness.',
        category: 'Musculoskeletal'
      },
      {
        id: '7',
        term: 'Hypothyroidism',
        definition: 'A condition in which the thyroid gland does not produce enough thyroid hormone.',
        simplified: 'When your thyroid gland doesn\'t make enough hormones, slowing down your body.',
        category: 'Endocrine'
      },
      {
        id: '8',
        term: 'Chronic Obstructive Pulmonary Disease',
        definition: 'A group of lung diseases that block airflow and make breathing difficult.',
        simplified: 'Lung diseases that make it hard to breathe, including emphysema and chronic bronchitis.',
        category: 'Respiratory'
      },
      {
        id: '9',
        term: 'Gastroesophageal Reflux Disease',
        definition: 'A chronic digestive disease in which stomach acid or bile flows back into the food pipe, irritating the lining.',
        simplified: 'Acid reflux - when stomach acid frequently flows back into the tube connecting your mouth and stomach.',
        category: 'Digestive'
      },
      {
        id: '10',
        term: 'Renal Failure',
        definition: 'A condition in which the kidneys lose the ability to remove waste and balance fluids.',
        simplified: 'When your kidneys stop working properly and can\'t filter blood the way they should.',
        category: 'Renal'
      }
    ];
    
    setMedicalTerms(terms);
    setFilteredTerms(terms);
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('medicalTermFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Filter terms based on search
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTerms(activeTab === 'all' ? medicalTerms : medicalTerms.filter(term => favorites.includes(term.id)));
      return;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    const filtered = medicalTerms.filter(term => {
      const matchesTerm = term.term.toLowerCase().includes(lowercaseSearch);
      const matchesDefinition = term.definition.toLowerCase().includes(lowercaseSearch);
      const matchesSimplified = term.simplified.toLowerCase().includes(lowercaseSearch);
      const matchesCategory = term.category.toLowerCase().includes(lowercaseSearch);
      
      return matchesTerm || matchesDefinition || matchesSimplified || matchesCategory;
    });
    
    setFilteredTerms(activeTab === 'all' ? filtered : filtered.filter(term => favorites.includes(term.id)));
  }, [searchTerm, medicalTerms, favorites, activeTab]);

  const toggleFavorite = (id: string) => {
    let newFavorites;
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fav => fav !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('medicalTermFavorites', JSON.stringify(newFavorites));
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTabChange = (tab: 'all' | 'favorites') => {
    setActiveTab(tab);
    if (tab === 'favorites') {
      setFilteredTerms(medicalTerms.filter(term => favorites.includes(term.id)));
    } else {
      setFilteredTerms(searchTerm ? 
        medicalTerms.filter(term => term.term.toLowerCase().includes(searchTerm.toLowerCase())) : 
        medicalTerms
      );
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white gradient-text">
          <FaHeartbeat className="inline-block mr-2 text-red-500" />
          Medical Terminology
        </h3>
        
        <div className="flex border rounded-full overflow-hidden">
          <button
            onClick={() => handleTabChange('all')}
            className={`px-3 py-1 text-sm ${
              activeTab === 'all' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Terms
          </button>
          <button
            onClick={() => handleTabChange('favorites')}
            className={`px-3 py-1 text-sm ${
              activeTab === 'favorites' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Favorites
          </button>
        </div>
      </div>
      
      {/* Search input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search medical terms..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <BsSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      
      {/* Results */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((term) => (
            <motion.div
              key={term.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="glassmorphic rounded-lg p-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-medium text-white">{term.term}</h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => speakText(term.term)}
                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                    aria-label="Speak term"
                  >
                    <BsVolumeUp />
                  </button>
                  <button
                    onClick={() => toggleFavorite(term.id)}
                    className={`${favorites.includes(term.id) ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 transition-colors`}
                    aria-label={favorites.includes(term.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.includes(term.id) ? <BsStarFill /> : <BsStar />}
                  </button>
                </div>
              </div>
              
              <div className="mt-1">
                <p className="text-sm text-gray-300 mb-1">
                  <span className="text-indigo-400">Category:</span> {term.category}
                </p>
                <p className="text-sm text-gray-300 mb-2">{term.definition}</p>
                <div className="bg-gray-800 p-2 rounded border-l-2 border-indigo-500">
                  <p className="text-sm text-white">
                    <span className="text-indigo-400 font-medium">Simplified:</span> {term.simplified}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No medical terms found for "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
} 