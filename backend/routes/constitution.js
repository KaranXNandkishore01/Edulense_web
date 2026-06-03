const express = require('express');
const router = express.Router();
const Constitution = require('../models/Constitution');
const User = require('../models/User');
const path = require('path');
const nlpModel = require('../utils/nlpModel');
const { OpenAI } = require('openai');
const { GoogleGenAI } = require('@google/genai');

let openai;
let geminiClient;
let activeModel = 'gpt-3.5-turbo';

if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('expired_or_out_of_quota')) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
} 
if (process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const userId = req.headers['user-id'];
        if (!userId) return res.status(401).json({ error: 'User ID required' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        if (user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Admins only.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal auth error' });
    }
};

// GET all constitution data
router.get('/', async (req, res) => {
    try {
        const data = await Constitution.find().sort({ order: 1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch' });
    }
});

// POST new entry (Admin only)
router.post('/', isAdmin, async (req, res) => {
    try {
        const newEntry = new Constitution(req.body);
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create' });
    }
});

// BULK update (Admin only) - Replaces all existing data
router.post('/bulk', isAdmin, async (req, res) => {
    try {
        let { data } = req.body;
        console.log(`Bulk update received ${data?.length} raw entries`);

        if (!Array.isArray(data)) {
            return res.status(400).json({ error: 'Data must be an array of objects' });
        }

        // Auto-transform common field variations
        const transformedData = data.map(entry => {
            const newEntry = { ...entry };
            
            // Map Name -> title
            if (entry.Name && !entry.title) newEntry.title = entry.Name;
            
            // Map PartNo -> part
            if (entry.PartNo && !entry.part) newEntry.part = entry.PartNo;
            
            // Map Body/Text -> content
            if (entry.Text && !entry.content) newEntry.content = entry.Text;
            if (entry.Body && !entry.content) newEntry.content = entry.Body;
            
            // Guess type if missing
            if (!entry.type) {
                if (entry.articleNumber || entry.ArticleNo) {
                    newEntry.type = 'article';
                    if (entry.ArticleNo) newEntry.articleNumber = entry.ArticleNo;
                } else if (entry.part || entry.PartNo) {
                    newEntry.type = 'part';
                } else if (entry.title && entry.title.toUpperCase().includes('PREAMBLE')) {
                    newEntry.type = 'preamble';
                } else {
                    newEntry.type = 'article'; // Default
                }
            }
            
            // Final check for required fields if they are missing after mapping
            if (!newEntry.content) newEntry.content = 'Content not provided';
            if (!newEntry.title) newEntry.title = 'Untitled';
            
            return newEntry;
        });

        // Clear existing collection
        await Constitution.deleteMany({});
        console.log('Cleared existing constitution data');
        
        // Insert new data
        const insertedData = await Constitution.insertMany(transformedData);
        console.log(`Successfully inserted ${insertedData.length} records`);
        
        res.status(200).json({ 
            message: `Successfully updated ${insertedData.length} entries`,
            count: insertedData.length 
        });
    } catch (err) {
        console.error('Bulk update failure details:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: `Validation Error: ${err.message}` });
        }
        res.status(500).json({ error: `Bulk update failed: ${err.message}` });
    }
});

// PUT update entry (Admin only)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const updatedEntry = await Constitution.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEntry);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update' });
    }
});

// DELETE entry (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        await Constitution.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Failed to delete' });
    }
});

// AI Search entry using custom NLP model + OpenAI
router.post('/ai-search', async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        const latestUserMessage = messages[messages.length - 1].content;
        const results = nlpModel.search(latestUserMessage, 3);
        let sources = [];
        let contextText = "No direct context found in the Constitution.";

        if (results.length > 0) {
            contextText = results.map(r => `Article/Part: ${r.title}\nContent: ${r.content}`).join("\n\n");
            
            results.forEach((resItem) => {
                let type = 'article';
                let articleNumber = '';
                if (resItem.title.toLowerCase().includes('preamble')) type = 'preamble';
                else if (resItem.title.toLowerCase().includes('part')) type = 'part';
                
                const match = resItem.title.match(/(\d+[A-Z]?)/);
                if (match) articleNumber = match[1];

                sources.push({
                    title: resItem.title,
                    type,
                    part: type === 'part' ? resItem.title : '',
                    articleNumber
                });
            });
        }
        
        let answerText = "";

        if (!openai && !geminiClient) {
            answerText = "⚠️ **API Key Missing**: Please set GEMINI_API_KEY or OPENAI_API_KEY in your .env file to talk to DigiLawyer.\n\n" + 
                         "Here is what I found in the Constitution without AI analysis:\n\n" + contextText;
        } else {
            const systemPrompt = `You are DigiLawyer, a professional and highly knowledgeable lawyer specializing in the Constitution of India. 
You chat like a real lawyer, explaining charges, laws, and constitutional rights in a clear, descriptive, and human-like way.
Use the following exact extracts from the Constitution of India to answer the user's latest query accurately. If the context doesn't have the answer, use your general legal knowledge but clarify it.

Context from Constitution:
${contextText}`;

            if (geminiClient) {
                // Native Gemini SDK
                const chatHistory = messages.slice(-6).map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));

                const response = await geminiClient.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: chatHistory,
                    config: {
                        systemInstruction: systemPrompt,
                        temperature: 0.7
                    }
                });
                answerText = response.text;
            } else {
                // Fallback to OpenAI SDK if only OpenAI key exists
                const chatHistory = messages.slice(-6).map(m => ({
                    role: m.role,
                    content: m.content
                }));
                
                const apiMessages = [
                    { role: 'system', content: systemPrompt },
                    ...chatHistory
                ];

                const completion = await openai.chat.completions.create({
                    model: activeModel,
                    messages: apiMessages,
                    temperature: 0.7,
                });

                answerText = completion.choices[0].message.content;
            }
        }

        res.json({
            answer: answerText,
            sources: sources
        });

    } catch (err) {
        console.error('AI Search Error:', err.message);
        
        // Check if it's a quota error
        if (err.message.includes('insufficient_quota') || err.message.includes('exceeded your current quota')) {
            return res.status(500).json({ 
                error: 'Quota Exceeded', 
                details: 'Your OpenAI API key has run out of credits. Please use a Gemini API key instead.' 
            });
        }
        
        res.status(500).json({ error: 'Failed to perform AI Search' });
    }
});

module.exports = router;
