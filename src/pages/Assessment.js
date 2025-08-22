import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Container,
} from '@mui/material';
import ReadingTest from '../components/tests/ReadingTest';
import WordRecognitionTest from '../components/tests/WordRecognitionTest';
import LetterReversalTest from '../components/tests/LetterReversalTest';
import VoiceReadingTest from '../components/tests/VoiceReadingTest';

const steps = [
  'Voice Reading Test',
  'Reading Speed Test',
  'Word Recognition',
  'Letter Reversal Test',
];

function Assessment() {
  const [activeStep, setActiveStep] = useState(0);
  const [results, setResults] = useState({});
  const navigate = useNavigate();

  const handleTestComplete = (testResults) => {
    setResults(prev => ({
      ...prev,
      [activeStep]: testResults
    }));

    if (activeStep === steps.length - 1) {
      // All tests completed, navigate to results
      navigate('/results', { state: { results: { ...results, [activeStep]: testResults } } });
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <VoiceReadingTest onComplete={handleTestComplete} />;
      case 1:
        return <ReadingTest onComplete={handleTestComplete} />;
      case 2:
        return <WordRecognitionTest onComplete={handleTestComplete} />;
      case 3:
        return <LetterReversalTest onComplete={handleTestComplete} />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Paper sx={{ p: 3 }}>
        {renderStepContent(activeStep)}
        
        {activeStep > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
            <Button
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Assessment; 