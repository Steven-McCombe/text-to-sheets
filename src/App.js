// src/App.js
import React, { useState } from 'react';

const apiKey = process.env.REACT_APP_OPENAPI_KEY;


function App() {
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');


  async function handleSubmit() {
    const url = 'https://api.openai.com/v1/chat/completions';
  
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  
    const body = JSON.stringify({
      model: 'gpt-4',  // Assuming GPT-4 is named as 'gpt-4.0-turbo'
      messages: [
        {
          role: 'system',
          content: 'You are an expert in Microsoft Excel and Google Sheets.'
        },
        {
          role: 'user',
          content: `Service: ${service}\nDescription: ${description}`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const result = data.choices[0].message.content.trim();
      setResult(result);
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  


function copyToClipboard() {
  navigator.clipboard.writeText(result);
}



  return (
    <div className="App">
      <select onChange={(e) => setService(e.target.value)}>
        <option value="">Select Service</option>
        <option value="Google Sheets">Google Sheets</option>
        <option value="Microsoft Excel">Microsoft Excel</option>
      </select>
      <textarea
        placeholder="Describe your problem or formula here..."
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
      <div className="result">
        {result}
        {result && (
          <button onClick={copyToClipboard}>Copy to Clipboard</button>
        )}
      </div>
    </div>
  );
}

export default App;
