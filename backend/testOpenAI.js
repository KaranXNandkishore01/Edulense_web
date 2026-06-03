const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
});

async function test() {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gemini-1.5-flash',
            messages: [{ role: 'user', content: 'hello' }],
        });
        console.log("Success:", completion.choices[0].message.content);
    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) {
            console.error(err.response.data);
        }
    }
}

test();
