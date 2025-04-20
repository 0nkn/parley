import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BsVolumeUp } from 'react-icons/bs';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { FaHeart, FaUtensils, FaToilet, FaWater, FaBed, FaRegSmile, FaRegSadTear, FaRegAngry } from 'react-icons/fa';
import { MdLocalHospital, MdAccessibility, MdPets, MdFamilyRestroom, MdEmojiTransportation } from 'react-icons/md';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: CommunicationItem[];
}

interface CommunicationItem {
  id: string;
  text: string;
  icon: React.ReactNode;
}

export default function CommunicationBoard({ 
  onSelectPhrase 
}: { 
  onSelectPhrase: (phrase: string) => void 
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 8;

  // Initialize categories with communication items
  useEffect(() => {
    setCategories([
      {
        id: 'basic',
        name: 'Basic Needs',
        icon: <FaWater className="text-blue-500" />,
        items: [
          { id: 'water', text: 'I need water', icon: <FaWater /> },
          { id: 'food', text: 'I need food', icon: <FaUtensils /> },
          { id: 'toilet', text: 'I need to use the toilet', icon: <FaToilet /> },
          { id: 'rest', text: 'I need to rest', icon: <FaBed /> },
          { id: 'help', text: 'I need help', icon: <MdAccessibility /> },
          { id: 'uncomfortable', text: 'I feel uncomfortable', icon: <FaRegSadTear /> },
          { id: 'pain', text: 'I am in pain', icon: <FaRegAngry /> },
          { id: 'good', text: 'I feel good', icon: <FaRegSmile /> },
        ]
      },
      {
        id: 'medical',
        name: 'Medical',
        icon: <MdLocalHospital className="text-red-500" />,
        items: [
          { id: 'medication', text: 'I need my medication', icon: <MdLocalHospital /> },
          { id: 'doctor', text: 'I need to see a doctor', icon: <MdLocalHospital /> },
          { id: 'nurse', text: 'I need to see a nurse', icon: <MdLocalHospital /> },
          { id: 'pain_chest', text: 'I have chest pain', icon: <FaHeart /> },
          { id: 'pain_head', text: 'I have a headache', icon: <FaRegSadTear /> },
          { id: 'pain_stomach', text: 'I have stomach pain', icon: <FaRegSadTear /> },
          { id: 'dizzy', text: 'I feel dizzy', icon: <FaRegSadTear /> },
          { id: 'nauseous', text: 'I feel nauseous', icon: <FaRegSadTear /> },
        ]
      },
      {
        id: 'family',
        name: 'Family',
        icon: <MdFamilyRestroom className="text-green-500" />,
        items: [
          { id: 'call_family', text: 'I want to call my family', icon: <MdFamilyRestroom /> },
          { id: 'visit_family', text: 'I want my family to visit', icon: <MdFamilyRestroom /> },
          { id: 'spouse', text: 'I want to see my spouse', icon: <MdFamilyRestroom /> },
          { id: 'children', text: 'I want to see my children', icon: <MdFamilyRestroom /> },
          { id: 'parents', text: 'I want to see my parents', icon: <MdFamilyRestroom /> },
          { id: 'siblings', text: 'I want to see my siblings', icon: <MdFamilyRestroom /> },
          { id: 'friend', text: 'I want to see my friend', icon: <MdFamilyRestroom /> },
          { id: 'pet', text: 'I miss my pet', icon: <MdPets /> },
        ]
      },
      {
        id: 'activities',
        name: 'Activities',
        icon: <MdEmojiTransportation className="text-purple-500" />,
        items: [
          { id: 'walk', text: 'I want to go for a walk', icon: <MdAccessibility /> },
          { id: 'outside', text: 'I want to go outside', icon: <MdEmojiTransportation /> },
          { id: 'tv', text: 'I want to watch TV', icon: <MdEmojiTransportation /> },
          { id: 'book', text: 'I want to read a book', icon: <MdEmojiTransportation /> },
          { id: 'music', text: 'I want to listen to music', icon: <MdEmojiTransportation /> },
          { id: 'bath', text: 'I want to take a bath', icon: <FaWater /> },
          { id: 'sleep', text: 'I want to sleep', icon: <FaBed /> },
          { id: 'home', text: 'I want to go home', icon: <MdEmojiTransportation /> },
        ]
      }
    ]);
  }, []);

  const currentCategory = categories.find(cat => cat.id === selectedCategory) || categories[0];
  const totalPages = currentCategory ? Math.ceil(currentCategory.items.length / itemsPerPage) : 0;
  const currentItems = currentCategory 
    ? currentCategory.items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) 
    : [];

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemClick = (item: CommunicationItem) => {
    onSelectPhrase(item.text);
    
    // Text-to-speech simulation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(item.text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4 text-center gradient-text">Visual Communication Board</h3>
      
      {/* Category selector */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
        {categories.map(category => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory(category.id);
              setCurrentPage(0);
            }}
            className={`flex items-center px-3 py-2 rounded-lg ${
              selectedCategory === category.id 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } transition-all duration-200`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </motion.button>
        ))}
      </div>
      
      {/* Communication items grid */}
      <div className="grid grid-cols-2 gap-3 mb-2">
        {currentItems.map(item => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleItemClick(item)}
            className="glassmorphic p-3 rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center text-center hover-glow"
          >
            <div className="text-3xl mb-2 text-indigo-400">{item.icon}</div>
            <div className="text-sm text-white">{item.text}</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakPhrase(item.text);
              }}
              className="mt-2 text-gray-400 hover:text-indigo-400 transition-colors"
              aria-label="Speak phrase"
            >
              <BsVolumeUp />
            </button>
          </motion.div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`p-2 rounded-full ${
              currentPage === 0 ? 'text-gray-600' : 'text-white hover:bg-gray-700'
            }`}
          >
            <RiArrowLeftSLine size={20} />
          </motion.button>
          
          <span className="text-sm text-gray-400">
            {currentPage + 1} / {totalPages}
          </span>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className={`p-2 rounded-full ${
              currentPage >= totalPages - 1 ? 'text-gray-600' : 'text-white hover:bg-gray-700'
            }`}
          >
            <RiArrowRightSLine size={20} />
          </motion.button>
        </div>
      )}
    </div>
  );
} 