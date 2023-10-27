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
          content: 'You are a helpful assistant that provides explanations and examples in a structured JSON format. and example of the format is as follows: Overview: explain whether you understood the request or if you need more info, Formula: Provide the formula only, explanation:provide an explanation of the formula. The json should follow this strict format. Do not include any other objects in the json.'
        },
        {
          role: 'user',
          content: `Service: ${service}\nDescription, generate a formula that: ${description}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
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
  
  
  let parsedResult = null;
  try {
    parsedResult = JSON.parse(result);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
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
        {parsedResult && (
          <>
            <h2>Overview</h2>
            <p>{parsedResult.Overview}</p>

            <h2>Formula</h2>
            <pre className="formula">{parsedResult.Formula}</pre>

            <h2>Explanation</h2>
            <p>{parsedResult.Explanation}</p>
            <button onClick={() => navigator.clipboard.writeText(parsedResult.Formula)}>
              Copy Formula to Clipboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}


export default App;
