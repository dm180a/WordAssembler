import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import WordDisplay from "@/components/word-display";
import type { Word } from "@shared/schema";

export default function VocabularyBuilder() {
  const [currentWordText, setCurrentWordText] = useState("dishonesty");
  const [isAssembled, setIsAssembled] = useState(true);

  const { data: words, isLoading: wordsLoading } = useQuery({
    queryKey: ["/api/words"],
  });

  const { data: currentWord, isLoading: currentWordLoading } = useQuery({
    queryKey: ["/api/words", currentWordText],
    enabled: !!currentWordText,
  });

  const handleDisassemble = () => {
    setIsAssembled(false);
  };

  const handleAssemble = () => {
    setIsAssembled(true);
  };

  const handleWordSelect = (word: string) => {
    setCurrentWordText(word);
    setIsAssembled(true);
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case "prefix": return "lego-red";
      case "root": return "lego-blue"; 
      case "suffix": return "lego-green";
      default: return "lego-blue";
    }
  };

  if (wordsLoading || currentWordLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading vocabulary builder...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-inter">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🧱 LEGO Vocabulary Builder</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Break down words into their building blocks! Click on each LEGO piece to discover how prefixes, roots, and suffixes work together.
          </p>
        </div>

        {/* Main Vocabulary Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Word Display Area */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Current Word:</h2>
              
              {currentWord && (
                <WordDisplay 
                  word={currentWord}
                  isAssembled={isAssembled}
                />
              )}
              
              {/* Complete Word Display */}
              <div className="text-3xl font-bold text-gray-800 mb-2">
                {currentWord?.word}
              </div>
              <div className="text-lg text-gray-600">
                {currentWord?.definition}
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                onClick={handleAssemble}
                className="bg-lego-blue hover:bg-blue-600 text-white"
                disabled={isAssembled}
              >
                🔨 Assemble
              </Button>
              <Button 
                onClick={handleDisassemble}
                className="bg-lego-orange hover:bg-orange-600 text-white"
                disabled={!isAssembled}
              >
                🔧 Disassemble
              </Button>
            </div>

            {/* Word Parts Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <div className="w-4 h-4 bg-lego-red rounded mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-800">Prefix</div>
                  <div className="text-sm text-gray-600">Beginning part that modifies meaning</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-4 h-4 bg-lego-blue rounded mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-800">Root</div>
                  <div className="text-sm text-gray-600">Core meaning of the word</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <div className="w-4 h-4 bg-lego-green rounded mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-800">Suffix</div>
                  <div className="text-sm text-gray-600">Ending that changes word type</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Examples Section */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Try More Words!</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {words?.map((word: Word) => (
                <div 
                  key={word.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => handleWordSelect(word.word)}
                >
                  <div className="font-semibold text-gray-800 mb-2">{word.word}</div>
                  <div className="flex gap-1 text-sm flex-wrap">
                    {word.components.prefix && (
                      <span className="bg-lego-red text-white px-2 py-1 rounded text-xs">
                        {word.components.prefix}
                      </span>
                    )}
                    <span className="bg-lego-blue text-white px-2 py-1 rounded text-xs">
                      {word.components.root}
                    </span>
                    {word.components.suffix && (
                      <span className="bg-lego-green text-white px-2 py-1 rounded text-xs">
                        {word.components.suffix}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
