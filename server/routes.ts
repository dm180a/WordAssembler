import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWordSchema, insertMorphemeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all words
  app.get("/api/words", async (req, res) => {
    try {
      const { search } = req.query;
      const words = await storage.getAllWords();
      
      if (search && typeof search === 'string') {
        const filteredWords = words.filter(word => 
          word.word.toLowerCase().includes(search.toLowerCase())
        );
        res.json(filteredWords);
      } else {
        res.json(words);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch words" });
    }
  });

  // Get specific word
  app.get("/api/words/:word", async (req, res) => {
    try {
      const word = await storage.getWord(req.params.word);
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }
      res.json(word);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch word" });
    }
  });

  // Create new word
  app.post("/api/words", async (req, res) => {
    try {
      const validatedData = insertWordSchema.parse(req.body);
      const word = await storage.createWord(validatedData);
      res.status(201).json(word);
    } catch (error) {
      res.status(400).json({ message: "Invalid word data" });
    }
  });

  // Get morpheme by text and type
  app.get("/api/morphemes/:text/:type", async (req, res) => {
    try {
      const morpheme = await storage.getMorpheme(req.params.text, req.params.type);
      if (!morpheme) {
        return res.status(404).json({ message: "Morpheme not found" });
      }
      res.json(morpheme);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch morpheme" });
    }
  });

  // Get morphemes by type
  app.get("/api/morphemes/type/:type", async (req, res) => {
    try {
      const morphemes = await storage.getMorphemesByType(req.params.type);
      res.json(morphemes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch morphemes" });
    }
  });

  // Create new morpheme
  app.post("/api/morphemes", async (req, res) => {
    try {
      const validatedData = insertMorphemeSchema.parse(req.body);
      const morpheme = await storage.createMorpheme(validatedData);
      res.status(201).json(morpheme);
    } catch (error) {
      res.status(400).json({ message: "Invalid morpheme data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
