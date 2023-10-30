// src/App.js
import React, { useState } from 'react';
import './styles.css'; 
import { 
  Container, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import ButtonGroup from '@material-ui/core/ButtonGroup'

const apiKey = process.env.REACT_APP_OPENAPI_KEY;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  buttonGroup: {
    margin: theme.spacing(1),
  },
  serviceButton: {
    minWidth: '130px',  
    padding: '8px 16px', 

  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  result: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  }
}));

function App() {
  const classes = useStyles();
  const [service, setService] = useState('Microsoft Excel'); 
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handler for button click
  const handleServiceChange = (service) => {
    setService(service);
  };

  async function handleSubmit() {
    setIsLoading(true);
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
          content: 'You are a helpful assistant that provides explanations and examples in a structured JSON format. and example of the format is as follows: Overview: explain whether you understood the request or if you need more info, Formula: Provide the formula only, explanation:provide an explanation of the formula, example: provide a consise example. The json should follow this strict format. Do not include any other objects in the json.'
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
    } finally {
      setIsLoading(false);  // Set loading to false at the end, whether successful or not
  }
  }
  
  
  let parsedResult = null;
  let isError = false;
  if (result) {  
    try {
      parsedResult = JSON.parse(result);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      isError = true;
    }
  }

  const renderJSON = (obj) => {
    return Object.keys(obj).map((key, index) => {
      if (key === "Formula") {
        // Special rendering for Formula
        return (
          <div key={index}>
            <Typography variant="h6">{key}</Typography>
            <div className="codeContainer">
          <pre className="codeBlock">{parsedResult.Formula}</pre>
          <FileCopyOutlinedIcon
            className="copyIcon"
            onClick={() => navigator.clipboard.writeText(parsedResult.Formula)}
          />
        </div>
          </div>
        );
      }
      if (typeof obj[key] === 'object') {
        // Recurse if the value is another object
        return (
          <div key={index}>
            <Typography variant="h6">{key}</Typography>
            {renderJSON(obj[key])}
          </div>
        );
      }
      return (
        <div key={index}>
          <Typography variant="h6">{key}</Typography>
          <Typography paragraph>{obj[key]}</Typography>
        </div>
      );
    });
  };
  


  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>Formula Generator</Typography>
      <ButtonGroup 
        color="primary" 
        aria-label="outlined primary button group" 
        className={classes.buttonGroup}  // Apply the class to the ButtonGroup
      >
        <Button 
          variant={service === 'Microsoft Excel' ? "contained" : "outlined"} 
          onClick={() => handleServiceChange('Microsoft Excel')}
          className={classes.serviceButton}  // Apply the class to each Button
        >
          Excel
        </Button>
        <Button 
          variant={service === 'Google Sheets' ? "contained" : "outlined"} 
          onClick={() => handleServiceChange('Google Sheets')}
          className={classes.serviceButton}  // Apply the class to each Button
        >
          Google Sheets
        </Button>
        </ButtonGroup>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        multiline
        minRows={4}
        label="Describe your problem or formula here..."
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {isLoading && <CircularProgress color="success" />}  {/* Render loading text when isLoading is true */}
      <Paper className={classes.result} elevation={3}>
      {parsedResult ? (
        renderJSON(parsedResult)
      ) : (
        isError && <Typography color="error">{result}</Typography>
      )}
    </Paper>
    </Container>
  );
}



export default App;
