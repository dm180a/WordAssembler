import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import WordDisplay from "@/components/word-display";
import type { Word } from "@shared/schema";

export default function VocabularyBuilder() {
  const [currentWordText, setCurrentWordText] = useState("dishonesty");
  const [isAssembled, setIsAssembled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: words, isLoading: wordsLoading } = useQuery({
    queryKey: ["/api/words"],
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["/api/words", "search", searchTerm],
    queryFn: async () => {
      const response = await fetch(`/api/words?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) throw new Error('Failed to search words');
      return response.json();
    },
    enabled: searchTerm.length >= 2,
  });

  const suggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    return searchResults?.slice(0, 5) || [];
  }, [searchResults, searchTerm]);

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
    setSearchTerm("");
    setShowSuggestions(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleSearchInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSearchInputBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      e.preventDefault();
      handleWordSelect(suggestions[0].word);
    }
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
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-900 dark:text-gray-100">Loading vocabulary builder...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-inter">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">🧱 Word Assembler</h1>
          
          {/* Search Section */}
          <div className="relative max-w-md mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="단어 검색... (예: disappear)"
                value={searchTerm}
                onChange={handleSearchInputChange}
                onFocus={handleSearchInputFocus}
                onBlur={handleSearchInputBlur}
                onKeyDown={handleSearchKeyDown}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
            
            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 mt-1">
                {suggestions.map((word) => (
                  <div
                    key={word.word}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0 text-left"
                    onClick={() => handleWordSelect(word.word)}
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">{word.word}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No results message */}
            {showSuggestions && searchTerm.length >= 2 && suggestions.length === 0 && !searchLoading && (
              <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 mt-1">
                <div className="px-4 py-2 text-gray-500 dark:text-gray-400 text-center">
                  "{searchTerm}"에 대한 검색 결과가 없습니다
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Vocabulary Card */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {/* Word Display Area */}
            <div className="text-center mb-8">

              
              {currentWord && (
                <WordDisplay 
                  word={currentWord}
                  isAssembled={isAssembled}
                  onWordSelect={handleWordSelect}
                />
              )}
              
              {/* Complete Word Display */}
              <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {currentWord?.word}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300">
                {currentWord?.definition}
              </div>
            </div>

            {/* Toggle Button */}
            <div className="flex justify-center mb-8">
              <Button 
                onClick={isAssembled ? handleDisassemble : handleAssemble}
                className={`${
                  isAssembled 
                    ? "bg-lego-orange hover:bg-orange-600" 
                    : "bg-lego-blue hover:bg-blue-600"
                } text-white transition-colors duration-300`}
              >
                {isAssembled ? "🔧 Disassemble" : "🔨 Assemble"}
              </Button>
            </div>

            {/* Word Parts Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="w-4 h-4 bg-lego-red rounded mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">Prefix</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Beginning part that modifies meaning</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="w-4 h-4 bg-lego-blue rounded mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">Root</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Core meaning of the word</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-4 h-4 bg-lego-green rounded mr-3"></div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">Suffix</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Ending that changes word type</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Examples Section */}
        <Card>
          <CardContent className="p-8">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">Try More Words!</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {words?.map((word: Word) => (
                <div 
                  key={word.id}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  onClick={() => handleWordSelect(word.word)}
                >
                  <div className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{word.word}</div>
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
