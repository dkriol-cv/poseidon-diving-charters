import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = "Loading..." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0b1216]"
    >
      <Loader2 className="h-10 w-10 animate-spin text-[#03c4c9] mb-4" />
      <p className="text-gray-500 font-medium animate-pulse">{text}</p>
    </motion.div>
  );
};

export default LoadingSpinner;