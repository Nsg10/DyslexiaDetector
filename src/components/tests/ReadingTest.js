import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

const readingPassage = `
The old house stood at the end of a quiet street. Its windows were dusty, and ivy crept up its weathered walls. Many people in the town said it was haunted, but Sarah didn't believe in ghosts. She was more interested in the history of the place. Who had lived there? What stories could those walls tell? One day, she decided to find out. With her notebook in hand, she began researching at the local library. What she discovered was far more interesting than any ghost story.
`;

const comprehensionQuestions = [
  {
    question: "What was Sarah's main interest in the old house?",
    options: [
      "The ghost stories",
      "The house's history",
      "The ivy on the walls",
      "The dusty windows"
    ],
    correctAnswer: 1
  },
  {
    question: "Where did Sarah go to research the house?",
    options: [
      "The old house",
      "The town hall",
      "The local library",
      "The neighborhood"
    ],
    correctAnswer: 2
  }
];

function ReadingTest({ onComplete }) {
  const [stage, setStage] = useState('reading'); // reading, questions, completed
  const [startTime, setStartTime] = useState(null);
  const [readingTime, setReadingTime] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (stage === 'reading') {
      setStartTime(Date.now());
    }
  }, [stage]);

  const handleReadingComplete = () => {
    const endTime = Date.now();
    const timeSpent = (endTime - startTime) / 1000; // Convert to seconds
    setReadingTime(timeSpent);
    setStage('questions');
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: parseInt(value)
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    comprehensionQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return (correct / comprehensionQuestions.length) * 100;
  };

  const handleSubmit = () => {
    const comprehensionScore = calculateScore();
    // Calculate reading speed (words per minute)
    const wordCount = readingPassage.trim().split(/\s+/).length;
    const readingSpeedWPM = Math.round((wordCount / readingTime) * 60);
    
    onComplete({
      comprehensionScore,
      readingSpeedWPM,
      readingTime
    });
  };

  if (stage === 'reading') {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Reading Speed Test
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Read the following passage carefully. Click "Done Reading" when you finish.
        </Typography>
        <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="body1" paragraph>
            {readingPassage}
          </Typography>
        </Paper>
        <Button variant="contained" onClick={handleReadingComplete}>
          Done Reading
        </Button>
      </Box>
    );
  }

  if (stage === 'questions') {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Comprehension Questions
        </Typography>
        {comprehensionQuestions.map((q, index) => (
          <FormControl key={index} sx={{ mb: 3, width: '100%' }}>
            <FormLabel>{q.question}</FormLabel>
            <RadioGroup
              value={answers[index] || ''}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            >
              {q.options.map((option, optionIndex) => (
                <FormControlLabel
                  key={optionIndex}
                  value={optionIndex}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        ))}
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length !== comprehensionQuestions.length}
        >
          Submit Answers
        </Button>
      </Box>
    );
  }

  return null;
}

export default ReadingTest; 