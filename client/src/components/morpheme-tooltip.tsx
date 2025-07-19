import { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { Morpheme } from "@shared/schema";

interface MorphemeTooltipProps {
  text: string;
  type: string;
  position: { x: number; y: number };
  onClose: () => void;
  onWordSelect?: (word: string) => void;
}

export default function MorphemeTooltip({ text, type, position, onClose, onWordSelect }: MorphemeTooltipProps) {
  const { data: morpheme, isLoading } = useQuery({
    queryKey: ["/api/morphemes", text, type],
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".tooltip") && !target.closest(".lego-block")) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const getBlockColor = (type: string) => {
    switch (type) {
      case "prefix": return "hsl(229, 70%, 54%)"; // lego-red
      case "root": return "hsl(207, 90%, 54%)"; // lego-blue
      case "suffix": return "hsl(147, 51%, 47%)"; // lego-green
      default: return "hsl(207, 90%, 54%)";
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className="tooltip show"
        style={{
          position: "fixed",
          left: `${position.x - 140}px`,
          top: `${position.y}px`,
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        <div className="tooltip-content">
          <div className="text-center py-4 text-gray-800 dark:text-gray-100">Loading...</div>
        </div>
      </motion.div>
    );
  }

  if (!morpheme) {
    return null;
  }

  return (
    <motion.div
      className="tooltip show"
      style={{
        position: "fixed",
        left: `${Math.max(10, Math.min(position.x - 140, window.innerWidth - 290))}px`,
        top: `${position.y}px`,
        zIndex: 50,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className="tooltip-content">
        <div className="flex items-center mb-3">
          <div 
            className="w-6 h-6 rounded mr-3" 
            style={{ backgroundColor: getBlockColor(morpheme.type) }}
          />
          <h4 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            {morpheme.text} ({morpheme.type})
          </h4>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-3">
          {morpheme.definition}
        </p>
        
        <div className="mb-3">
          <h5 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Other examples:</h5>
          <div className="flex flex-wrap gap-2">
            {morpheme.examples.map((example, index) => (
              <button 
                key={index}
                onClick={() => {
                  if (onWordSelect) {
                    onWordSelect(example);
                    onClose();
                  }
                }}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1 rounded text-sm transition-colors cursor-pointer border dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={onClose}
          className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100"
          variant="secondary"
        >
          Close
        </Button>
      </div>
    </motion.div>
  );
}
