
async function testOllama() {
    console.log('Sending request to Ollama...');
    const response = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3',
            prompt: 'Output a valid JSON object with {"status": "ok"}',
            format: 'json',
            stream: false
        })
    });

    const text = await response.text();
    console.log(`Status: ${response.status}`);
    console.log(`Response Body: ${text}`);
}

testOllama();
