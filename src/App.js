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
      model: 'gpt-4',  
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that provides detailed explanations and examples in a structured JSON format. and example of the format is as follows: Overview: explain whether you understood the request or if you need more info, Formula: Provide the formula only, explanation:provide an explanation of the formula, example:provide an example of the formula in action'
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
