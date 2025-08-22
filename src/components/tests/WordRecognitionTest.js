import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardActionArea,
  CardContent,
} from '@mui/material';

const wordPairs = [
  {
    correct: 'beautiful',
    incorrect: 'beautifull',
    hint: 'Adjective: pleasing to the senses or mind'
  },
  {
    correct: 'necessary',
    incorrect: 'neccesary',
    hint: 'Adjective: required, essential'
  },
  {
    correct: 'receive',
    incorrect: 'recieve',
    hint: 'Verb: to get or be given something'
  },
  {
    correct: 'separate',
    incorrect: 'seperate',
    hint: 'Verb/Adjective: to divide or set apart'
  },
  {
    correct: 'definitely',
    incorrect: 'definately',
    hint: 'Adverb: without doubt, clearly'
  }
];

function WordRecognitionTest({ onComplete }) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentPairIndex]);

  const handleWordSelect = (isCorrect) => {
    const endTime = Date.now();
    const timeSpent = endTime - startTime;
    setTimes(prev => [...prev, timeSpent]);
    
    setAnswers(prev => [...prev, isCorrect]);

    if (currentPairIndex < wordPairs.length - 1) {
      setCurrentPairIndex(prev => prev + 1);
    } else {
      const accuracy = (answers.filter(a => a).length / wordPairs.length) * 100;
      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      onComplete({
        accuracy,
        averageResponseTime: averageTime,
        totalCorrect: answers.filter(a => a).length,
        totalQuestions: wordPairs.length
      });
    }
  };

  const currentPair = wordPairs[currentPairIndex];
  const shuffledWords = [
    { word: currentPair.correct, isCorrect: true },
    { word: currentPair.incorrect, isCorrect: false }
  ].sort(() => Math.random() - 0.5);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Word Recognition Test
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Select the correctly spelled word.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="body1" gutterBottom>
          Hint: {currentPair.hint}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Question {currentPairIndex + 1} of {wordPairs.length}
        </Typography>
      </Paper>

      <Grid container spacing={2}>
        {shuffledWords.map((item, index) => (
          <Grid item xs={6} key={index}>
            <Card>
              <CardActionArea onClick={() => handleWordSelect(item.isCorrect)}>
                <CardContent>
                  <Typography variant="h5" align="center">
                    {item.word}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Progress: {currentPairIndex + 1} / {wordPairs.length}
        </Typography>
      </Box>
    </Box>
  );
}

export default WordRecognitionTest; 