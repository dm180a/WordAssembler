import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LegoBlock from "./lego-block";
import MorphemeTooltip from "./morpheme-tooltip";
import type { Word } from "@shared/schema";

interface WordDisplayProps {
  word: Word;
  isAssembled: boolean;
}

export default function WordDisplay({ word, isAssembled }: WordDisplayProps) {
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
    assembled: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 300,
      },
    },
    disassembled: {
      y: -200,
      opacity: 0,
      scale: 0.8,
      rotate: -10,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 400,
      },
    },
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
        <AnimatePresence mode="sync">
          {components.map((component, index) => (
            <motion.div
              key={`${component.text}-${component.type}`}
              variants={blockVariants}
              initial={isAssembled ? "assembled" : "disassembled"}
              animate={isAssembled ? "assembled" : "disassembled"}
              exit="disassembled"
              custom={index}
              style={{
                display: "inline-block",
                margin: "0 4px",
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
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {activeTooltip && (
          <MorphemeTooltip
            text={activeTooltip.text}
            type={activeTooltip.type}
            position={activeTooltip.position}
            onClose={handleCloseTooltip}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
