import { words, morphemes, type Word, type InsertWord, type Morpheme, type InsertMorpheme } from "@shared/schema";

export interface IStorage {
  // Word operations
  getWord(word: string): Promise<Word | undefined>;
  getAllWords(): Promise<Word[]>;
  createWord(word: InsertWord): Promise<Word>;
  
  // Morpheme operations
  getMorpheme(text: string, type: string): Promise<Morpheme | undefined>;
  getMorphemesByType(type: string): Promise<Morpheme[]>;
  createMorpheme(morpheme: InsertMorpheme): Promise<Morpheme>;
}

export class MemStorage implements IStorage {
  private words: Map<string, Word>;
  private morphemes: Map<string, Morpheme>;
  private currentWordId: number;
  private currentMorphemeId: number;

  constructor() {
    this.words = new Map();
    this.morphemes = new Map();
    this.currentWordId = 1;
    this.currentMorphemeId = 1;
    
    // Initialize with example data
    this.initializeData();
  }

  private async initializeData() {
    // Create morphemes
    const disMorpheme = await this.createMorpheme({
      text: "dis-",
      type: "prefix",
      definition: 'Means "not" or "opposite of" - reverses the meaning of the root word',
      examples: ["disagree", "disappear", "disconnect", "dislike", "disturb"]
    });

    const honestMorpheme = await this.createMorpheme({
      text: "honest",
      type: "root",
      definition: 'From Latin "honestus" meaning honorable, decent, or truthful',
      examples: ["honestly", "honesty", "dishonest", "honester"]
    });

    const yMorpheme = await this.createMorpheme({
      text: "-y",
      type: "suffix", 
      definition: 'Forms nouns meaning "quality of" or "state of being"',
      examples: ["honesty", "happiness", "darkness", "weakness"]
    });

    const unMorpheme = await this.createMorpheme({
      text: "un-",
      type: "prefix",
      definition: 'Means "not" or "reverse of"',
      examples: ["unhappy", "unlock", "undo", "unfair"]
    });

    const happyMorpheme = await this.createMorpheme({
      text: "happy",
      type: "root",
      definition: "Feeling or showing pleasure or contentment",
      examples: ["happiness", "unhappy", "happily", "happier"]
    });

    const nessMorpheme = await this.createMorpheme({
      text: "-ness",
      type: "suffix",
      definition: "Forms nouns expressing a state or condition",
      examples: ["happiness", "sadness", "kindness", "darkness"]
    });

    const reMorpheme = await this.createMorpheme({
      text: "re-",
      type: "prefix",
      definition: "Again, back, or anew",
      examples: ["rebuild", "return", "remake", "reconstruct"]
    });

    const constructMorpheme = await this.createMorpheme({
      text: "construct",
      type: "root",
      definition: "To build or form by putting together parts",
      examples: ["construction", "reconstruct", "constructive", "constructor"]
    });

    const ionMorpheme = await this.createMorpheme({
      text: "-ion",
      type: "suffix",
      definition: "Forms nouns indicating action or process",
      examples: ["construction", "creation", "education", "celebration"]
    });

    const respectMorpheme = await this.createMorpheme({
      text: "respect",
      type: "root",
      definition: "A feeling of deep admiration for someone or something",
      examples: ["respectful", "disrespect", "respectable", "respectfully"]
    });

    const fulMorpheme = await this.createMorpheme({
      text: "-ful",
      type: "suffix",
      definition: "Full of, characterized by",
      examples: ["respectful", "helpful", "beautiful", "wonderful"]
    });

    // Create example words
    await this.createWord({
      word: "dishonesty",
      definition: "the quality of being fraudulent or deceitful",
      components: {
        prefix: "dis-",
        root: "honest",
        suffix: "-y"
      }
    });

    await this.createWord({
      word: "unhappiness", 
      definition: "the feeling of not being happy; sadness",
      components: {
        prefix: "un-",
        root: "happy",
        suffix: "-ness"
      }
    });

    await this.createWord({
      word: "reconstruction",
      definition: "the action of building something again",
      components: {
        prefix: "re-",
        root: "construct",
        suffix: "-ion"
      }
    });

    await this.createWord({
      word: "disrespectful",
      definition: "showing a lack of respect; rude",
      components: {
        prefix: "dis-",
        root: "respect",
        suffix: "-ful"
      }
    });
  }

  async getWord(word: string): Promise<Word | undefined> {
    return this.words.get(word);
  }

  async getAllWords(): Promise<Word[]> {
    return Array.from(this.words.values());
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const id = this.currentWordId++;
    const word: Word = { ...insertWord, id };
    this.words.set(insertWord.word, word);
    return word;
  }

  async getMorpheme(text: string, type: string): Promise<Morpheme | undefined> {
    const key = `${text}-${type}`;
    return this.morphemes.get(key);
  }

  async getMorphemesByType(type: string): Promise<Morpheme[]> {
    return Array.from(this.morphemes.values()).filter(m => m.type === type);
  }

  async createMorpheme(insertMorpheme: InsertMorpheme): Promise<Morpheme> {
    const id = this.currentMorphemeId++;
    const morpheme: Morpheme = { ...insertMorpheme, id };
    const key = `${insertMorpheme.text}-${insertMorpheme.type}`;
    this.morphemes.set(key, morpheme);
    return morpheme;
  }
}

export const storage = new MemStorage();
