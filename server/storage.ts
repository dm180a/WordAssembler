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
      examples: ["honesty", "safety", "modesty", "plenty"]
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

    // Add comprehensive vocabulary dataset
    const vocabularyData = [
      // Words with dis- prefix
      { word: "disrespect", definition: "lack of respect; rudeness", components: { prefix: "dis-", root: "respect", suffix: "" }},
      { word: "discontinue", definition: "to stop doing something", components: { prefix: "dis-", root: "continue", suffix: "" }},
      { word: "discomfort", definition: "slight pain or unease", components: { prefix: "dis-", root: "comfort", suffix: "" }},
      { word: "disadvantage", definition: "an unfavorable circumstance", components: { prefix: "dis-", root: "advantage", suffix: "" }},
      { word: "disapprove", definition: "to have an unfavorable opinion", components: { prefix: "dis-", root: "approve", suffix: "" }},
      
      // Words with un- prefix
      { word: "unhappy", definition: "not happy; sad", components: { prefix: "un-", root: "happy", suffix: "" }},
      { word: "unlock", definition: "to open with a key", components: { prefix: "un-", root: "lock", suffix: "" }},
      { word: "undo", definition: "to reverse an action", components: { prefix: "un-", root: "do", suffix: "" }},
      { word: "unfair", definition: "not just or right", components: { prefix: "un-", root: "fair", suffix: "" }},
      { word: "unable", definition: "not able; incapable", components: { prefix: "un-", root: "able", suffix: "" }},
      { word: "uncertain", definition: "not sure or definite", components: { prefix: "un-", root: "certain", suffix: "" }},
      { word: "unwise", definition: "not wise; foolish", components: { prefix: "un-", root: "wise", suffix: "" }},
      { word: "unsafe", definition: "not safe; dangerous", components: { prefix: "un-", root: "safe", suffix: "" }},
      { word: "unclear", definition: "not clear; confusing", components: { prefix: "un-", root: "clear", suffix: "" }},
      { word: "unreal", definition: "not real; imaginary", components: { prefix: "un-", root: "real", suffix: "" }},
      
      // Words with re- prefix
      { word: "rebuild", definition: "to build again", components: { prefix: "re-", root: "build", suffix: "" }},
      { word: "return", definition: "to come or go back", components: { prefix: "re-", root: "turn", suffix: "" }},
      { word: "remake", definition: "to make again", components: { prefix: "re-", root: "make", suffix: "" }},
      { word: "rewrite", definition: "to write again", components: { prefix: "re-", root: "write", suffix: "" }},
      { word: "replay", definition: "to play again", components: { prefix: "re-", root: "play", suffix: "" }},
      { word: "restart", definition: "to start again", components: { prefix: "re-", root: "start", suffix: "" }},
      { word: "reopen", definition: "to open again", components: { prefix: "re-", root: "open", suffix: "" }},
      { word: "review", definition: "to examine again", components: { prefix: "re-", root: "view", suffix: "" }},
      { word: "recycle", definition: "to use again", components: { prefix: "re-", root: "cycle", suffix: "" }},
      { word: "repeat", definition: "to do again", components: { prefix: "re-", root: "peat", suffix: "" }},
      
      // Words with pre- prefix
      { word: "preview", definition: "to view beforehand", components: { prefix: "pre-", root: "view", suffix: "" }},
      { word: "prepare", definition: "to get ready", components: { prefix: "pre-", root: "pare", suffix: "" }},
      { word: "predict", definition: "to say beforehand", components: { prefix: "pre-", root: "dict", suffix: "" }},
      { word: "prevent", definition: "to stop beforehand", components: { prefix: "pre-", root: "vent", suffix: "" }},
      { word: "prefix", definition: "a word part before the root", components: { prefix: "pre-", root: "fix", suffix: "" }},
      
      // Words with -ly suffix
      { word: "quickly", definition: "in a quick manner", components: { prefix: "", root: "quick", suffix: "-ly" }},
      { word: "slowly", definition: "in a slow manner", components: { prefix: "", root: "slow", suffix: "-ly" }},
      { word: "clearly", definition: "in a clear manner", components: { prefix: "", root: "clear", suffix: "-ly" }},
      { word: "really", definition: "in a real manner; truly", components: { prefix: "", root: "real", suffix: "-ly" }},
      { word: "finally", definition: "at the end", components: { prefix: "", root: "final", suffix: "-ly" }},
      { word: "safely", definition: "in a safe manner", components: { prefix: "", root: "safe", suffix: "-ly" }},
      { word: "kindly", definition: "in a kind manner", components: { prefix: "", root: "kind", suffix: "-ly" }},
      { word: "honestly", definition: "in an honest manner", components: { prefix: "", root: "honest", suffix: "-ly" }},
      { word: "quietly", definition: "in a quiet manner", components: { prefix: "", root: "quiet", suffix: "-ly" }},
      { word: "loudly", definition: "in a loud manner", components: { prefix: "", root: "loud", suffix: "-ly" }},
      
      // Words with -ness suffix
      { word: "happiness", definition: "the state of being happy", components: { prefix: "", root: "happy", suffix: "-ness" }},
      { word: "sadness", definition: "the state of being sad", components: { prefix: "", root: "sad", suffix: "-ness" }},
      { word: "kindness", definition: "the quality of being kind", components: { prefix: "", root: "kind", suffix: "-ness" }},
      { word: "darkness", definition: "the state of being dark", components: { prefix: "", root: "dark", suffix: "-ness" }},
      { word: "weakness", definition: "the state of being weak", components: { prefix: "", root: "weak", suffix: "-ness" }},
      { word: "goodness", definition: "the quality of being good", components: { prefix: "", root: "good", suffix: "-ness" }},
      { word: "fairness", definition: "the quality of being fair", components: { prefix: "", root: "fair", suffix: "-ness" }},
      { word: "illness", definition: "the state of being ill", components: { prefix: "", root: "ill", suffix: "-ness" }},
      { word: "madness", definition: "the state of being mad", components: { prefix: "", root: "mad", suffix: "-ness" }},
      { word: "boldness", definition: "the quality of being bold", components: { prefix: "", root: "bold", suffix: "-ness" }},
      
      // Words with -ful suffix
      { word: "helpful", definition: "giving help; useful", components: { prefix: "", root: "help", suffix: "-ful" }},
      { word: "beautiful", definition: "pleasing to look at", components: { prefix: "", root: "beauty", suffix: "-ful" }},
      { word: "wonderful", definition: "inspiring wonder", components: { prefix: "", root: "wonder", suffix: "-ful" }},
      { word: "careful", definition: "taking care; cautious", components: { prefix: "", root: "care", suffix: "-ful" }},
      { word: "hopeful", definition: "having hope", components: { prefix: "", root: "hope", suffix: "-ful" }},
      { word: "peaceful", definition: "calm and quiet", components: { prefix: "", root: "peace", suffix: "-ful" }},
      { word: "powerful", definition: "having power", components: { prefix: "", root: "power", suffix: "-ful" }},
      { word: "useful", definition: "able to be used", components: { prefix: "", root: "use", suffix: "-ful" }},
      { word: "colorful", definition: "having many colors", components: { prefix: "", root: "color", suffix: "-ful" }},
      { word: "thankful", definition: "feeling gratitude", components: { prefix: "", root: "thank", suffix: "-ful" }},
      
      // Words with -less suffix
      { word: "hopeless", definition: "without hope", components: { prefix: "", root: "hope", suffix: "-less" }},
      { word: "careless", definition: "without care", components: { prefix: "", root: "care", suffix: "-less" }},
      { word: "harmless", definition: "without harm", components: { prefix: "", root: "harm", suffix: "-less" }},
      { word: "helpless", definition: "without help", components: { prefix: "", root: "help", suffix: "-less" }},
      { word: "fearless", definition: "without fear", components: { prefix: "", root: "fear", suffix: "-less" }},
      { word: "useless", definition: "without use", components: { prefix: "", root: "use", suffix: "-less" }},
      { word: "endless", definition: "without end", components: { prefix: "", root: "end", suffix: "-less" }},
      { word: "homeless", definition: "without a home", components: { prefix: "", root: "home", suffix: "-less" }},
      { word: "mindless", definition: "without thought", components: { prefix: "", root: "mind", suffix: "-less" }},
      { word: "painless", definition: "without pain", components: { prefix: "", root: "pain", suffix: "-less" }},
      
      // Complex words with multiple parts
      { word: "unhelpful", definition: "not providing help", components: { prefix: "un-", root: "help", suffix: "-ful" }},
      { word: "disagreeable", definition: "unpleasant; difficult", components: { prefix: "dis-", root: "agree", suffix: "-able" }},
      { word: "uncomfortable", definition: "not comfortable", components: { prefix: "un-", root: "comfort", suffix: "-able" }},
      { word: "unforgettable", definition: "impossible to forget", components: { prefix: "un-", root: "forget", suffix: "-able" }},
      { word: "unbreakable", definition: "cannot be broken", components: { prefix: "un-", root: "break", suffix: "-able" }},
      { word: "remarkable", definition: "worthy of attention", components: { prefix: "re-", root: "mark", suffix: "-able" }},
      { word: "predictable", definition: "able to be predicted", components: { prefix: "pre-", root: "dict", suffix: "-able" }},
      { word: "renewable", definition: "able to be renewed", components: { prefix: "re-", root: "new", suffix: "-able" }},
      { word: "preventable", definition: "able to be prevented", components: { prefix: "pre-", root: "vent", suffix: "-able" }},
      { word: "reusable", definition: "able to be used again", components: { prefix: "re-", root: "use", suffix: "-able" }},
      
      // Words with -er suffix
      { word: "teacher", definition: "one who teaches", components: { prefix: "", root: "teach", suffix: "-er" }},
      { word: "worker", definition: "one who works", components: { prefix: "", root: "work", suffix: "-er" }},
      { word: "player", definition: "one who plays", components: { prefix: "", root: "play", suffix: "-er" }},
      { word: "runner", definition: "one who runs", components: { prefix: "", root: "run", suffix: "-er" }},
      { word: "writer", definition: "one who writes", components: { prefix: "", root: "write", suffix: "-er" }},
      { word: "speaker", definition: "one who speaks", components: { prefix: "", root: "speak", suffix: "-er" }},
      { word: "helper", definition: "one who helps", components: { prefix: "", root: "help", suffix: "-er" }},
      { word: "leader", definition: "one who leads", components: { prefix: "", root: "lead", suffix: "-er" }},
      { word: "builder", definition: "one who builds", components: { prefix: "", root: "build", suffix: "-er" }},
      { word: "maker", definition: "one who makes", components: { prefix: "", root: "make", suffix: "-er" }},
      
      // Words with -ing suffix
      { word: "reading", definition: "the act of reading", components: { prefix: "", root: "read", suffix: "-ing" }},
      { word: "writing", definition: "the act of writing", components: { prefix: "", root: "write", suffix: "-ing" }},
      { word: "running", definition: "the act of running", components: { prefix: "", root: "run", suffix: "-ing" }},
      { word: "singing", definition: "the act of singing", components: { prefix: "", root: "sing", suffix: "-ing" }},
      { word: "dancing", definition: "the act of dancing", components: { prefix: "", root: "dance", suffix: "-ing" }},
      { word: "cooking", definition: "the act of cooking", components: { prefix: "", root: "cook", suffix: "-ing" }},
      { word: "learning", definition: "the act of learning", components: { prefix: "", root: "learn", suffix: "-ing" }},
      { word: "teaching", definition: "the act of teaching", components: { prefix: "", root: "teach", suffix: "-ing" }},
      { word: "building", definition: "the act of building", components: { prefix: "", root: "build", suffix: "-ing" }},
      { word: "playing", definition: "the act of playing", components: { prefix: "", root: "play", suffix: "-ing" }},
      
      // Words with -ed suffix
      { word: "played", definition: "past tense of play", components: { prefix: "", root: "play", suffix: "-ed" }},
      { word: "worked", definition: "past tense of work", components: { prefix: "", root: "work", suffix: "-ed" }},
      { word: "learned", definition: "past tense of learn", components: { prefix: "", root: "learn", suffix: "-ed" }},
      { word: "helped", definition: "past tense of help", components: { prefix: "", root: "help", suffix: "-ed" }},
      { word: "walked", definition: "past tense of walk", components: { prefix: "", root: "walk", suffix: "-ed" }},
      { word: "talked", definition: "past tense of talk", components: { prefix: "", root: "talk", suffix: "-ed" }},
      { word: "called", definition: "past tense of call", components: { prefix: "", root: "call", suffix: "-ed" }},
      { word: "opened", definition: "past tense of open", components: { prefix: "", root: "open", suffix: "-ed" }},
      { word: "closed", definition: "past tense of close", components: { prefix: "", root: "close", suffix: "-ed" }},
      { word: "wanted", definition: "past tense of want", components: { prefix: "", root: "want", suffix: "-ed" }},
      
      // Words with -tion suffix
      { word: "creation", definition: "the act of creating", components: { prefix: "", root: "create", suffix: "-tion" }},
      { word: "education", definition: "the process of learning", components: { prefix: "", root: "educate", suffix: "-tion" }},
      { word: "celebration", definition: "the act of celebrating", components: { prefix: "", root: "celebrate", suffix: "-tion" }},
      { word: "information", definition: "facts or knowledge", components: { prefix: "", root: "inform", suffix: "-tion" }},
      { word: "preparation", definition: "the act of preparing", components: { prefix: "pre-", root: "pare", suffix: "-tion" }},
      { word: "decoration", definition: "something that decorates", components: { prefix: "", root: "decorate", suffix: "-tion" }},
      { word: "invitation", definition: "an act of inviting", components: { prefix: "", root: "invite", suffix: "-tion" }},
      { word: "location", definition: "a particular place", components: { prefix: "", root: "locate", suffix: "-tion" }},
      { word: "vacation", definition: "time off from work", components: { prefix: "", root: "vacate", suffix: "-tion" }},
      { word: "station", definition: "a place or building", components: { prefix: "", root: "stat", suffix: "-ion" }},
      
      // More complex combinations
      { word: "reconstruction", definition: "building again", components: { prefix: "re-", root: "construct", suffix: "-tion" }},
      { word: "disconnection", definition: "the act of disconnecting", components: { prefix: "dis-", root: "connect", suffix: "-tion" }},
      { word: "uncomfortable", definition: "not comfortable", components: { prefix: "un-", root: "comfort", suffix: "-able" }},
      { word: "unfriendly", definition: "not friendly", components: { prefix: "un-", root: "friend", suffix: "-ly" }},
      { word: "prehistoric", definition: "before recorded history", components: { prefix: "pre-", root: "historic", suffix: "" }},
      { word: "prediction", definition: "a statement about the future", components: { prefix: "pre-", root: "dict", suffix: "-tion" }},
      { word: "prevention", definition: "the act of preventing", components: { prefix: "pre-", root: "vent", suffix: "-tion" }},
      { word: "renewable", definition: "able to be made new again", components: { prefix: "re-", root: "new", suffix: "-able" }},
      { word: "unreliable", definition: "not able to be trusted", components: { prefix: "un-", root: "rely", suffix: "-able" }},
      { word: "disagreeably", definition: "in an unpleasant way", components: { prefix: "dis-", root: "agree", suffix: "-ably" }}
    ];

    // Add additional morphemes needed for the vocabulary
    const additionalMorphemes = [
      // Additional prefixes
      { text: "pre-", type: "prefix", definition: "Before or earlier", examples: ["preview", "prepare", "predict", "prevent", "prefix"] },
      
      // Additional roots
      { text: "able", type: "root", definition: "Having the ability", examples: ["unable", "capable", "enable", "disable"] },
      { text: "comfort", type: "root", definition: "Physical ease and freedom from pain", examples: ["comfortable", "uncomfortable", "discomfort", "comforting"] },
      { text: "advantage", type: "root", definition: "A condition giving a greater chance of success", examples: ["disadvantage", "advantageous", "advantages", "advantage"] },
      { text: "approve", type: "root", definition: "To officially agree to or accept", examples: ["disapprove", "approval", "approved", "approving"] },
      { text: "lock", type: "root", definition: "A fastening device", examples: ["unlock", "locked", "locking", "locker"] },
      { text: "fair", type: "root", definition: "Treating people equally", examples: ["unfair", "fairly", "fairness", "fairer"] },
      { text: "certain", type: "root", definition: "Known for sure", examples: ["uncertain", "certainly", "certainty", "ascertain"] },
      { text: "wise", type: "root", definition: "Having wisdom", examples: ["unwise", "wisely", "wisdom", "wiser"] },
      { text: "safe", type: "root", definition: "Protected from danger", examples: ["unsafe", "safely", "safety", "safer"] },
      { text: "clear", type: "root", definition: "Easy to understand", examples: ["unclear", "clearly", "clarity", "clearer"] },
      { text: "real", type: "root", definition: "Actually existing", examples: ["unreal", "really", "reality", "realize"] },
      { text: "build", type: "root", definition: "To construct", examples: ["rebuild", "builder", "building", "built"] },
      { text: "turn", type: "root", definition: "To move in a circle", examples: ["return", "turned", "turning", "turner"] },
      { text: "make", type: "root", definition: "To create or produce", examples: ["remake", "maker", "making", "made"] },
      { text: "write", type: "root", definition: "To mark letters or words", examples: ["rewrite", "writer", "writing", "written"] },
      { text: "play", type: "root", definition: "To engage in games", examples: ["replay", "player", "playing", "played"] },
      { text: "start", type: "root", definition: "To begin", examples: ["restart", "starter", "starting", "started"] },
      { text: "open", type: "root", definition: "Not closed", examples: ["reopen", "opener", "opening", "opened"] },
      { text: "view", type: "root", definition: "To look at", examples: ["review", "preview", "viewer", "viewing"] },
      { text: "cycle", type: "root", definition: "A series that repeats", examples: ["recycle", "bicycle", "cycling", "cyclist"] },
      { text: "quick", type: "root", definition: "Fast", examples: ["quickly", "quicker", "quickest", "quicken"] },
      { text: "slow", type: "root", definition: "Not fast", examples: ["slowly", "slower", "slowest", "slowing"] },
      { text: "final", type: "root", definition: "Last", examples: ["finally", "finalist", "finalize", "finals"] },
      { text: "kind", type: "root", definition: "Caring and helpful", examples: ["kindly", "kindness", "kinder", "kindest"] },
      { text: "quiet", type: "root", definition: "Making little noise", examples: ["quietly", "quieter", "quietest", "quieten"] },
      { text: "loud", type: "root", definition: "Making much noise", examples: ["loudly", "louder", "loudest", "loudness"] },
      { text: "sad", type: "root", definition: "Feeling unhappy", examples: ["sadness", "sadly", "sadder", "saddest"] },
      { text: "dark", type: "root", definition: "Having little light", examples: ["darkness", "darkly", "darker", "darkest"] },
      { text: "weak", type: "root", definition: "Not strong", examples: ["weakness", "weakly", "weaker", "weakest"] },
      { text: "good", type: "root", definition: "Having positive qualities", examples: ["goodness", "better", "best", "goody"] },
      { text: "ill", type: "root", definition: "Sick or unwell", examples: ["illness", "illy", "iller", "illest"] },
      { text: "mad", type: "root", definition: "Angry or crazy", examples: ["madness", "madly", "madder", "maddest"] },
      { text: "bold", type: "root", definition: "Confident and brave", examples: ["boldness", "boldly", "bolder", "boldest"] },
      { text: "beauty", type: "root", definition: "The quality of being beautiful", examples: ["beautiful", "beautify", "beautician", "beauties"] },
      { text: "wonder", type: "root", definition: "A feeling of amazement", examples: ["wonderful", "wondering", "wondered", "wonders"] },
      { text: "care", type: "root", definition: "The provision of what is needed", examples: ["careful", "careless", "caring", "carer"] },
      { text: "hope", type: "root", definition: "A feeling of expectation", examples: ["hopeful", "hopeless", "hoping", "hoped"] },
      { text: "peace", type: "root", definition: "Freedom from conflict", examples: ["peaceful", "peacefully", "peacekeeping", "peacemaker"] },
      { text: "power", type: "root", definition: "The ability to do something", examples: ["powerful", "powerless", "empowered", "overpowered"] },
      { text: "use", type: "root", definition: "To employ for a purpose", examples: ["useful", "useless", "reusable", "user"] },
      { text: "color", type: "root", definition: "The appearance of things", examples: ["colorful", "colorless", "coloring", "colored"] },
      { text: "thank", type: "root", definition: "To express gratitude", examples: ["thankful", "thankless", "thanks", "thanking"] },
      { text: "harm", type: "root", definition: "Physical injury", examples: ["harmless", "harmful", "harming", "harmed"] },
      { text: "fear", type: "root", definition: "An unpleasant emotion", examples: ["fearless", "fearful", "fearing", "feared"] },
      { text: "end", type: "root", definition: "The final part", examples: ["endless", "ending", "ended", "ender"] },
      { text: "home", type: "root", definition: "The place where one lives", examples: ["homeless", "homely", "homing", "homed"] },
      { text: "mind", type: "root", definition: "The faculty of thinking", examples: ["mindless", "mindful", "minding", "minded"] },
      { text: "pain", type: "root", definition: "Physical suffering", examples: ["painless", "painful", "paining", "pained"] },
      { text: "teach", type: "root", definition: "To give instruction", examples: ["teacher", "teaching", "taught", "teachable"] },
      { text: "work", type: "root", definition: "Activity involving effort", examples: ["worker", "working", "worked", "workable"] },
      { text: "run", type: "root", definition: "To move at speed", examples: ["runner", "running", "ran", "runnable"] },
      { text: "speak", type: "root", definition: "To say words", examples: ["speaker", "speaking", "spoke", "spoken"] },
      { text: "help", type: "root", definition: "To assist", examples: ["helper", "helping", "helped", "helpful"] },
      { text: "lead", type: "root", definition: "To guide", examples: ["leader", "leading", "led", "leadable"] },
      { text: "read", type: "root", definition: "To look at and understand", examples: ["reading", "reader", "readable", "reread"] },
      { text: "sing", type: "root", definition: "To produce musical sounds", examples: ["singing", "singer", "sang", "sung"] },
      { text: "dance", type: "root", definition: "To move rhythmically", examples: ["dancing", "dancer", "danced", "danceable"] },
      { text: "cook", type: "root", definition: "To prepare food", examples: ["cooking", "cooked", "cooker", "cookery"] },
      { text: "learn", type: "root", definition: "To acquire knowledge", examples: ["learning", "learned", "learner", "learnable"] },
      { text: "walk", type: "root", definition: "To move on foot", examples: ["walking", "walked", "walker", "walkable"] },
      { text: "talk", type: "root", definition: "To speak", examples: ["talking", "talked", "talker", "talkative"] },
      { text: "call", type: "root", definition: "To shout or telephone", examples: ["calling", "called", "caller", "callable"] },
      { text: "close", type: "root", definition: "To shut", examples: ["closing", "closed", "closer", "closest"] },
      { text: "want", type: "root", definition: "To desire", examples: ["wanting", "wanted", "wanter", "wantable"] },
      { text: "create", type: "root", definition: "To bring into existence", examples: ["creation", "creative", "creator", "created"] },
      { text: "educate", type: "root", definition: "To teach", examples: ["education", "educational", "educator", "educated"] },
      { text: "celebrate", type: "root", definition: "To mark with festivities", examples: ["celebration", "celebratory", "celebrity", "celebrated"] },
      { text: "inform", type: "root", definition: "To tell", examples: ["information", "informative", "informant", "informed"] },
      { text: "decorate", type: "root", definition: "To make beautiful", examples: ["decoration", "decorative", "decorator", "decorated"] },
      { text: "invite", type: "root", definition: "To ask to come", examples: ["invitation", "inviting", "invited", "invitee"] },
      { text: "locate", type: "root", definition: "To find the position", examples: ["location", "locating", "located", "locator"] },
      { text: "vacate", type: "root", definition: "To leave empty", examples: ["vacation", "vacating", "vacated", "vacancy"] },
      { text: "state", type: "root", definition: "To express clearly", examples: ["stating", "stated", "statement", "restate"] },
      { text: "stat", type: "root", definition: "To stand", examples: ["station", "static", "statue", "status"] },
      { text: "friend", type: "root", definition: "A person you like", examples: ["friendly", "unfriendly", "friendship", "befriend"] },
      { text: "historic", type: "root", definition: "Famous in history", examples: ["prehistoric", "historical", "historian", "history"] },
      { text: "rely", type: "root", definition: "To depend on", examples: ["reliable", "unreliable", "relying", "relied"] },
      
      // Additional prefixes
      { text: "pro-", type: "prefix", definition: "Forward or in favor of", examples: ["promotion", "progress", "project", "propose"] },
      { text: "e-", type: "prefix", definition: "Out or from", examples: ["emotion", "evaporate", "evacuate", "emerge"] },
      
      // Additional suffixes
      { text: "-able", type: "suffix", definition: "Capable of being", examples: ["agreeable", "comfortable", "readable", "breakable"] },
      { text: "-less", type: "suffix", definition: "Without", examples: ["hopeless", "careless", "harmless", "endless"] },
      { text: "-ly", type: "suffix", definition: "In a manner", examples: ["quickly", "slowly", "clearly", "kindly"] },
      { text: "-er", type: "suffix", definition: "One who does", examples: ["teacher", "worker", "player", "runner"] },
      { text: "-ing", type: "suffix", definition: "Present action", examples: ["reading", "writing", "running", "singing"] },
      { text: "-ed", type: "suffix", definition: "Past action", examples: ["played", "worked", "walked", "talked"] },
      { text: "-tion", type: "suffix", definition: "The act of", examples: ["creation", "education", "celebration", "information"] },
      { text: "-ion", type: "suffix", definition: "The act or state of", examples: ["station", "nation", "action", "motion"] },
      { text: "-ably", type: "suffix", definition: "In a way that can be", examples: ["disagreeably", "comfortably", "remarkably", "predictably"] },
      { text: "-ty", type: "suffix", definition: "State or quality of being", examples: ["loyalty", "safety", "beauty", "novelty"] }
    ];

    // Create additional morphemes
    for (const morphemeData of additionalMorphemes) {
      await this.createMorpheme(morphemeData);
    }

    // Add more etymologically accurate words
    const additionalWords = [
      { word: "safety", definition: "the condition of being safe", components: { prefix: "", root: "safe", suffix: "-ty" }},
      { word: "beauty", definition: "the quality of being beautiful", components: { prefix: "", root: "beauty", suffix: "" }}, // beauty is actually the root
      { word: "loyalty", definition: "the quality of being loyal", components: { prefix: "", root: "loyal", suffix: "-ty" }},
      { word: "penalty", definition: "a punishment for wrongdoing", components: { prefix: "", root: "penal", suffix: "-ty" }},
      { word: "novelty", definition: "the quality of being new", components: { prefix: "", root: "novel", suffix: "-ty" }},
      { word: "specialty", definition: "a special skill or area", components: { prefix: "", root: "special", suffix: "-ty" }},
      { word: "honesty", definition: "the quality of being honest", components: { prefix: "", root: "honest", suffix: "-y" }},
      { word: "modesty", definition: "the quality of being modest", components: { prefix: "", root: "modest", suffix: "-y" }},
      { word: "plenty", definition: "a large amount", components: { prefix: "", root: "plent", suffix: "-y" }},
      { word: "empty", definition: "containing nothing", components: { prefix: "", root: "empt", suffix: "-y" }},
      
      // More -ion words with stat- root
      { word: "nation", definition: "a country", components: { prefix: "", root: "nat", suffix: "-ion" }},
      { word: "action", definition: "something done", components: { prefix: "", root: "act", suffix: "-ion" }},
      { word: "motion", definition: "movement", components: { prefix: "", root: "mot", suffix: "-ion" }},
      { word: "emotion", definition: "feeling", components: { prefix: "e-", root: "mot", suffix: "-ion" }},
      { word: "devotion", definition: "dedication", components: { prefix: "de-", root: "vot", suffix: "-ion" }},
      { word: "promotion", definition: "advancement", components: { prefix: "pro-", root: "mot", suffix: "-ion" }}
    ];

    // Add corresponding root morphemes
    const additionalRootMorphemes = [
      { text: "loyal", type: "root", definition: "Faithful and devoted", examples: ["loyalty", "disloyal", "loyalist", "loyally"] },
      { text: "penal", type: "root", definition: "Related to punishment", examples: ["penalty", "penalize", "penal", "penalties"] },
      { text: "novel", type: "root", definition: "New and original", examples: ["novelty", "novelist", "novelize", "novels"] },
      { text: "special", type: "root", definition: "Better than usual", examples: ["specialty", "specialist", "specialize", "specially"] },
      { text: "modest", type: "root", definition: "Not boastful", examples: ["modesty", "modestly", "immodest", "modestness"] },
      { text: "plent", type: "root", definition: "Abundance", examples: ["plenty", "plentiful", "replenish", "plenty"] },
      { text: "empt", type: "root", definition: "Without contents", examples: ["empty", "emptied", "emptying", "emptiness"] },
      
      // Additional roots for -ion words
      { text: "nat", type: "root", definition: "Born, birth", examples: ["nation", "native", "nature", "innate"] },
      { text: "act", type: "root", definition: "To do", examples: ["action", "active", "actor", "activity"] },
      { text: "mot", type: "root", definition: "To move", examples: ["motion", "motor", "promote", "emotion"] },
      { text: "vot", type: "root", definition: "To vow", examples: ["devotion", "vote", "devote", "votive"] }
    ];

    // Create additional morphemes and words
    for (const morphemeData of additionalRootMorphemes) {
      await this.createMorpheme(morphemeData);
    }

    for (const wordData of additionalWords) {
      await this.createWord(wordData);
    }

    // Create all vocabulary words
    for (const wordData of vocabularyData) {
      await this.createWord(wordData);
    }
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
