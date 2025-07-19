import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LegoBlock from "./lego-block";
import MorphemeTooltip from "./morpheme-tooltip";
import type { Word } from "@shared/schema";

interface WordDisplayProps {
  word: Word;
  isAssembled: boolean;
  onWordSelect?: (word: string) => void;
}

export default function WordDisplay({ word, isAssembled, onWordSelect }: WordDisplayProps) {
  const [activeTooltip, setActiveTooltip] = useState<{
    text: string;
    type: string;
    position: { x: number; y: number };
  } | null>(null);

  const handleBlockClick = (text: string, type: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setActiveTooltip({
      text,
      type,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.bottom + 10,
      },
    });
  };

  const handleCloseTooltip = () => {
    setActiveTooltip(null);
  };

  const containerVariants = {
    assembled: {
      transition: {
        staggerChildren: 0.2,
      },
    },
    disassembled: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const blockVariants = {
    assembled: (index: number) => ({
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: index * 0.1,
      },
    }),
    disassembled: (index: number) => ({
      x: (index - 1) * 60, // Shorter distance between blocks
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 400,
        delay: index * 0.1,
      },
    }),
  };

  const components = [];
  
  if (word.components.prefix) {
    components.push({
      text: word.components.prefix,
      type: "prefix",
    });
  }
  
  components.push({
    text: word.components.root,
    type: "root",
  });
  
  if (word.components.suffix) {
    components.push({
      text: word.components.suffix,
      type: "suffix",
    });
  }

  return (
    <div className="relative">
      <motion.div 
        className="word-container mb-6"
        variants={containerVariants}
        animate={isAssembled ? "assembled" : "disassembled"}
        initial="assembled"
      >
        {components.map((component, index) => (
          <motion.div
            key={`${component.text}-${component.type}`}
            variants={blockVariants}
            initial="assembled"
            animate={isAssembled ? "assembled" : "disassembled"}
            custom={index}
            style={{
              display: "inline-block",
              margin: isAssembled ? "0" : "0 8px",
            }}
          >
            <LegoBlock
              text={component.text}
              type={component.type}
              onClick={(event) => handleBlockClick(component.text, component.type, event)}
              isActive={activeTooltip?.text === component.text && activeTooltip?.type === component.type}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {activeTooltip && (
          <MorphemeTooltip
            text={activeTooltip.text}
            type={activeTooltip.type}
            position={activeTooltip.position}
            onClose={handleCloseTooltip}
            onWordSelect={onWordSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
