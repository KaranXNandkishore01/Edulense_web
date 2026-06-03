const fs = require('fs');
const csv = require('csv-parser');
const natural = require('natural');
const TfIdf = natural.TfIdf;
const path = require('path');

class NLPModel {
    constructor() {
        this.tfidf = new TfIdf();
        this.documents = [];
        this.isReady = false;
        this.tokenizer = new natural.WordTokenizer();
    }

    async init(csvFilePath) {
        return new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (data) => {
                    // Process CSV rows
                    const keys = Object.keys(data);
                    let title = data.Name || data.title || 'Untitled';
                    let content = data.Text || data.Body || data.content || '';
                    if (!content && keys.length > 0) {
                        content = data[keys[keys.length - 1]]; 
                    }
                    if (!title && keys.length > 0) {
                        title = data[keys[0]]; 
                    }
                    if (content) {
                        let docId = null;
                        if (title.toUpperCase().includes('PREAMBLE')) {
                            docId = 'preamble';
                        } else {
                            const match = title.match(/^([0-9]+[a-zA-Z]*)\./);
                            if (match) docId = `article-${match[1]}`;
                        }
                        results.push({ title, content, originalData: data, docId });
                    }
                })
                .on('end', () => {
                    results.forEach((doc) => {
                        this.documents.push(doc);
                        this.tfidf.addDocument(`${doc.title} ${doc.content}`);
                    });
                    this.isReady = true;
                    console.log(`✅ NLP Model trained on ${this.documents.length} documents.`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Failed to parse CSV:', err);
                    reject(err);
                });
        });
    }

    search(query, topK = 5) {
        if (!this.isReady) return [];
        const scores = [];
        this.tfidf.tfidfs(query, (i, measure) => {
            scores.push({ index: i, score: measure });
        });
        
        scores.sort((a, b) => b.score - a.score);
        
        const results = [];
        for (let i = 0; i < topK && i < scores.length; i++) {
            if (scores[i].score > 0) {
                results.push({
                    title: this.documents[scores[i].index].title,
                    content: this.documents[scores[i].index].content,
                    score: scores[i].score
                });
            }
        }
        return results;
    }

    generateQuestions(count = 5, difficulty = 'medium', preferredDocIds = []) {
        if (!this.isReady || this.documents.length === 0) return [];
        
        const questions = [];
        const usedDocs = new Set();
        let attempts = 0;

        // Filter preferred docs
        const preferredDocs = this.documents.filter(d => d.docId && preferredDocIds.includes(d.docId));
        const hasPreferences = preferredDocs.length > 0;

        while (questions.length < count && attempts < count * 10) {
            attempts++;
            
            let docIndex;
            // 70% chance to pick a preferred doc if available, or force if we have many
            if (hasPreferences && (Math.random() < 0.7 || questions.length < preferredDocs.length)) {
                const pDoc = preferredDocs[Math.floor(Math.random() * preferredDocs.length)];
                docIndex = this.documents.indexOf(pDoc);
            } else {
                docIndex = Math.floor(Math.random() * this.documents.length);
            }
            
            if (usedDocs.has(docIndex)) continue;
            
            const doc = this.documents[docIndex];
            const content = doc.content;
            if (content.length < 50 || content.length > 600) continue; 

            // Extract Capitalized words > 4 chars as entities
            const tokens = this.tokenizer.tokenize(content);
            const words = tokens.filter(t => t.length > 4 && /^[A-Z][a-z]+$/.test(t));
            if (words.length === 0) continue;
            
            const targetWord = words[Math.floor(Math.random() * words.length)];
            const blankedContent = content.replace(new RegExp(`\\b${targetWord}\\b`, 'g'), '______');
            if (blankedContent === content) continue; // Regex didn't match

            // Generate Distractors
            const distractors = new Set();
            while(distractors.size < 3) {
                const randomDoc = this.documents[Math.floor(Math.random() * this.documents.length)];
                const rTokens = this.tokenizer.tokenize(randomDoc.content).filter(t => t.length > 4 && /^[A-Z][a-z]+$/.test(t));
                if (rTokens.length > 0) {
                    const rWord = rTokens[Math.floor(Math.random() * rTokens.length)];
                    if (rWord !== targetWord) distractors.add(rWord);
                }
            }
            
            const options = [targetWord, ...Array.from(distractors)];
            // Shuffle
            options.sort(() => Math.random() - 0.5);
            const correctIndex = options.indexOf(targetWord);
            
            questions.push({
                question: `Complete the following excerpt from ${doc.title}:\n\n"${blankedContent}"`,
                options: options,
                correct: correctIndex,
                article: doc.title,
                explanation: `The correct term is ${targetWord}.`
            });
            usedDocs.add(docIndex);
        }
        
        return questions;
    }
}

const nlpModel = new NLPModel();
module.exports = nlpModel;
