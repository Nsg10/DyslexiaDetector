import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';

const letterTests = [
  {
    letter: 'b',
    options: ['b', 'd'],
    correctIndex: 0,
    instruction: 'Select the correctly oriented letter "b"'
  },
  {
    letter: 'p',
    options: ['p', 'q'],
    correctIndex: 0,
    instruction: 'Select the correctly oriented letter "p"'
  },
  {
    letter: 'd',
    options: ['b', 'd'],
    correctIndex: 1,
    instruction: 'Select the correctly oriented letter "d"'
  },
  {
    letter: 'q',
    options: ['p', 'q'],
    correctIndex: 1,
    instruction: 'Select the correctly oriented letter "q"'
  },
  {
    letter: 'n',
    options: ['n', 'u'],
    correctIndex: 0,
    instruction: 'Select the correctly oriented letter "n"'
  }
];

function LetterReversalTest({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime] = useState(Date.now());

  const handleSelection = (selectedIndex) => {
    const isCorrect = selectedIndex === letterTests[currentIndex].correctIndex;
    setAnswers(prev => [...prev, isCorrect]);

    if (currentIndex < letterTests.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      const endTime = Date.now();
      const totalTime = (endTime - startTime) / 1000; // Convert to seconds
      const accuracy = (answers.filter(a => a).length / letterTests.length) * 100;
      
      onComplete({
        accuracy,
        totalTime,
        totalCorrect: answers.filter(a => a).length,
        totalQuestions: letterTests.length
      });
    }
  };

  const currentTest = letterTests[currentIndex];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Letter Reversal Test
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        This test checks your ability to identify correctly oriented letters.
      </Typography>

      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom align="center">
          {currentTest.instruction}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom align="center">
          Question {currentIndex + 1} of {letterTests.length}
        </Typography>
      </Paper>

      <Grid container spacing={2} justifyContent="center">
        {currentTest.options.map((option, index) => (
          <Grid item xs={6} key={index}>
            <Card>
              <CardActionArea onClick={() => handleSelection(index)}>
                <CardContent>
                  <Typography 
                    variant="h2" 
                    align="center"
                    sx={{ 
                      fontFamily: 'Arial',
                      fontSize: '72px',
                      fontWeight: 'bold'
                    }}
                  >
                    {option}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Progress: {currentIndex + 1} / {letterTests.length}
        </Typography>
      </Box>
    </Box>
  );
}

export default LetterReversalTest; 