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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function MorphemeTooltip({ text, type, position, onClose, onWordSelect, onMouseEnter, onMouseLeave }: MorphemeTooltipProps) {
  const { data: morpheme, isLoading } = useQuery({
    queryKey: ["/api/morphemes", text, type],
  });

  useEffect(() => {
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    
    const handleClickOutside = (event: MouseEvent) => {
      // Only close on click outside for mobile devices
      if (isMobile) {
        const target = event.target as HTMLElement;
        if (!target.closest(".tooltip") && !target.closest(".lego-block")) {
          onClose();
        }
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isMobile) {
      document.addEventListener("click", handleClickOutside);
    }
    document.addEventListener("keydown", handleEscape);

    return () => {
      if (isMobile) {
        document.removeEventListener("click", handleClickOutside);
      }
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
          <div className="text-center py-4">Loading...</div>
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="tooltip-content">
        <div className="flex items-center mb-3">
          <div 
            className="w-6 h-6 rounded mr-3" 
            style={{ backgroundColor: getBlockColor(morpheme.type) }}
          />
          <h4 className="font-bold text-lg">
            {morpheme.text} ({morpheme.type})
          </h4>
        </div>
        
        <p className="text-gray-600 mb-3">
          {morpheme.definition}
        </p>
        
        <div className="mb-3">
          <h5 className="font-semibold text-gray-800 mb-2">Other examples:</h5>
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
                className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-2 py-1 rounded text-sm transition-colors cursor-pointer border hover:border-blue-300"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
        
        <Button 
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
          variant="secondary"
        >
          Close
        </Button>
      </div>
    </motion.div>
  );
}
