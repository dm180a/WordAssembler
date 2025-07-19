import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LegoBlockProps {
  text: string;
  type: "prefix" | "root" | "suffix";
  onClick: (event: React.MouseEvent) => void;
  isActive?: boolean;
}

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
