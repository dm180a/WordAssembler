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

    // Add morphemes for example words
    const agreeMorpheme = await this.createMorpheme({
      text: "agree",
      type: "root",
      definition: "To have the same opinion; to consent",
      examples: ["agreement", "disagree", "agreeable", "agreeing"]
    });

    const appearMorpheme = await this.createMorpheme({
      text: "appear",
      type: "root",
      definition: "To come into sight; to seem",
      examples: ["appearance", "disappear", "apparent", "appearing"]
    });

    const connectMorpheme = await this.createMorpheme({
      text: "connect",
      type: "root",
      definition: "To join or link together",
      examples: ["connection", "disconnect", "connected", "connector"]
    });

    const likeMorpheme = await this.createMorpheme({
      text: "like",
      type: "root",
      definition: "To find agreeable or satisfactory",
      examples: ["likely", "dislike", "likable", "liking"]
    });

    const turbMorpheme = await this.createMorpheme({
      text: "turb",
      type: "root",
      definition: "To disturb or confuse",
      examples: ["disturb", "turbulent", "turbulence", "perturb"]
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

    // Add more example words that appear in morpheme examples
    await this.createWord({
      word: "disagree",
      definition: "to have a different opinion; not agree",
      components: {
        prefix: "dis-",
        root: "agree",
        suffix: ""
      }
    });

    await this.createWord({
      word: "disappear",
      definition: "to go out of sight; vanish",
      components: {
        prefix: "dis-",
        root: "appear",
        suffix: ""
      }
    });

    await this.createWord({
      word: "disconnect",
      definition: "to break the connection of; unplug",
      components: {
        prefix: "dis-",
        root: "connect",
        suffix: ""
      }
    });

    await this.createWord({
      word: "dislike",
      definition: "to regard with distaste or aversion",
      components: {
        prefix: "dis-",
        root: "like",
        suffix: ""
      }
    });

    await this.createWord({
      word: "disturb",
      definition: "to interfere with the normal arrangement",
      components: {
        prefix: "dis-",
        root: "turb",
        suffix: ""
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
    const word: Word = { 
      id, 
      word: insertWord.word,
      definition: insertWord.definition,
      components: {
        prefix: insertWord.components.prefix as string | undefined,
        root: insertWord.components.root,
        suffix: insertWord.components.suffix as string | undefined
      }
    };
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
    const morpheme: Morpheme = { 
      id,
      text: insertMorpheme.text,
      type: insertMorpheme.type,
      definition: insertMorpheme.definition,
      examples: (insertMorpheme.examples as string[]) || []
    };
    const key = `${insertMorpheme.text}-${insertMorpheme.type}`;
    this.morphemes.set(key, morpheme);
    return morpheme;
  }
}

export const storage = new MemStorage();
