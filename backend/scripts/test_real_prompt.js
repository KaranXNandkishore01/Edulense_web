async function testRealPrompt() {
    console.log('Sending complex prompt to Ollama...');
    const prompt = `You are an expert on the Indian Constitution and an adaptive learning assessment engine.

TASK: Generate exactly 10 multiple-choice questions for a quiz.

DIFFICULTY LEVEL: MEDIUM
The student is at an intermediate level (50–80%). Generate MEDIUM difficulty questions: mix conceptual understanding with recall, include questions on important articles and their scope, and avoid trivially easy or highly obscure questions.


STUDENT PROGRESS: The student is just beginning. Generate introductory questions covering the Preamble and Fundamental Rights (Part III).


RELEVANT CONSTITUTION CONTENT (base your questions strictly on this):
[Article 14]: Equality before law The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth
[Article 15]: Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth (1) The State shall not discriminate against any citizen on grounds only of religion, race, caste, sex, place of birth or any of them

OUTPUT FORMAT: Return ONLY a valid JSON object with this exact structure — no markdown, no explanation:
{
  "difficulty": "medium",
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "article": "Article 14",
      "explanation": "Brief explanation of why this is correct (1-2 sentences)."
    }
  ]
}

RULES:
- Exactly 10 questions, each with exactly 4 options
- "correct" is a zero-based integer index (0, 1, 2, or 3)
- All questions must be factually accurate about the Indian Constitution
- Vary the correct answer position across questions — don't always put it at index 0
- Include an "explanation" field for each question to help students learn`;

    const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3',
            prompt: prompt,
            format: 'json',
            stream: false,
            options: { temperature: 0.7 }
        })
    });

    const text = await response.text();
    console.log(`Status: ${response.status}`);
    console.log(`Response Body: ${text.substring(0, 500)}...`);
}

testRealPrompt();
