// src/App.js
import React, { useState } from 'react';
import './styles.css'; 
import { 
  Container, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  TextField, 
  Button, 
  Paper, 
  Typography,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';


const apiKey = process.env.REACT_APP_OPENAPI_KEY;

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
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
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);


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
    } finally {
      setIsLoading(false);  // Set loading to false at the end, whether successful or not
  }
  }
  
  
  let parsedResult = null;
  let isError = false;
  try {
    parsedResult = JSON.parse(result);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    isError = true;
  }



  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom>Formula Generator</Typography>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="service-label">Service</InputLabel>
        <Select
          labelId="service-label"
          value={service}
          onChange={(e) => setService(e.target.value)}
          label="Service"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Google Sheets">Google Sheets</MenuItem>
          <MenuItem value="Microsoft Excel">Microsoft Excel</MenuItem>
        </Select>
      </FormControl>
      <TextField
        variant="outlined"
        margin="normal"
        fullWidth
        multiline
        rows={4}
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
          <>
            <Typography variant="h6">Overview</Typography>
            <Typography paragraph>{parsedResult.Overview}</Typography>

            <Typography variant="h6">Formula</Typography>
        <div className="codeContainer">
          <FileCopyOutlinedIcon
            className="copyIcon"
            onClick={() => navigator.clipboard.writeText(parsedResult.Formula)}
          />
          <pre className="codeBlock">{parsedResult.Formula}</pre>
        </div>

            <Typography variant="h6">Explanation</Typography>
            <Typography paragraph>{parsedResult.Explanation}</Typography>
            <Button
              variant="outlined"
              className={classes.button}
              onClick={() => navigator.clipboard.writeText(parsedResult.Formula)}
            >
              Copy Formula to Clipboard
            </Button>
          </>
        ) : (
          isError && <Typography color="error">{result}</Typography>
        )}
      </Paper>
    </Container>
  );
}



export default App;
