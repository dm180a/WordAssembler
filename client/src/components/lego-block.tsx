import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LegoBlockProps {
  text: string;
  type: "prefix" | "root" | "suffix";
  onClick: (event: React.MouseEvent) => void;
  isActive?: boolean;
  hasPrefix?: boolean;
  hasSuffix?: boolean;
}

export default function LegoBlock({ text, type, onClick, isActive = false, hasPrefix = false, hasSuffix = false }: LegoBlockProps) {
  const getBlockStyles = (type: string) => {
    switch (type) {
      case "prefix":
        return "lego-block prefix-block";
      case "root":
        // Apply different root styles based on what connectors are needed
        if (hasPrefix && hasSuffix) {
          return "lego-block root-block"; // Both grooves
        } else if (hasPrefix && !hasSuffix) {
          return "lego-block root-block-left-only"; // Only left groove
        } else if (!hasPrefix && hasSuffix) {
          return "lego-block root-block-right-only"; // Only right groove
        } else {
          return "lego-block root-block-no-grooves"; // No grooves
        }
      case "suffix":
        return "lego-block suffix-block";
      default:
        return "lego-block root-block";
    }
  };

  return (
    <motion.div
      className={cn(
        getBlockStyles(type),
        "px-6 py-4 text-white font-semibold text-lg cursor-pointer select-none",
        isActive && "active"
      )}
      onClick={onClick}
      whileHover={{
        y: -4,
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
    >
      {text}
    </motion.div>
  );
}
