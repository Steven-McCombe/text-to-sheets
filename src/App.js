// src/App.js
import React, { useState } from 'react';

function App() {
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');


async function handleSubmit() {
  const openai = require('openai');
  const api = new openai.API({ key: process.env.REACT_APP_OPENAPI_KEY, engine: 'davinci' });

  try {
    const response = await api.createCompletion({
      prompt: `Service: ${service}\nDescription: ${description}`,
      temperature: 0.7,
      max_tokens: 150,
    });
    const result = response.choices[0].text.trim();
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
