import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LegoBlockProps {
  text: string;
  type: "prefix" | "root" | "suffix";
  onClick: (event: React.MouseEvent) => void;
  isActive?: boolean;
}

const getTypeDescription = (type: string) => {
  switch (type) {
    case "prefix":
      return "Beginning part that modifies meaning";
    case "root":
      return "Core meaning of the word";
    case "suffix":
      return "Ending that changes word type";
    default:
      return "";
  }
};

export default function LegoBlock({ text, type, onClick, isActive = false }: LegoBlockProps) {
  const getBlockStyles = (type: string) => {
    switch (type) {
      case "prefix":
        return "lego-block prefix-block";
      case "root":
        return "lego-block root-block";
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
        "px-6 py-4 text-white font-semibold text-lg cursor-pointer select-none relative group",
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
      {/* Type description tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {getTypeDescription(type)}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </motion.div>
  );
}
