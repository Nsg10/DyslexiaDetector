import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Paper,
  Container,
  Grid,
  LinearProgress,
  Card,
  CardContent,
  Alert,
} from '@mui/material';

function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const testResults = location.state?.results || {};

  const calculateOverallScore = () => {
    const scores = [];
    
    if (testResults[0]) {
      // Voice reading test score - use the assessment score directly
      if (testResults[0].assessment && !isNaN(testResults[0].assessment.score)) {
        scores.push(100 - testResults[0].assessment.score); // Convert dyslexia likelihood to performance score
      } else {
        // Fallback calculation if assessment score is not available
        const voiceScore = (
          (testResults[0].accuracy || 0) * 0.4 + // Accuracy weight
          (Math.min(100, ((testResults[0].wordsPerMinute || 0) / 150) * 100) * 0.3) + // Speed weight
          (Math.max(0, 100 - (testResults[0].hesitations || 0) * 10) * 0.15) + // Hesitations weight
          (Math.max(0, 100 - ((testResults[0].substitutions || 0) + (testResults[0].omissions || 0)) * 5) * 0.15) // Errors weight
        );
        scores.push(voiceScore);
      }
    }

    if (testResults[1]) {
      // Reading test score (50% comprehension, 50% speed)
      const speedScore = Math.min(100, (testResults[1].readingSpeedWPM / 250) * 100);
      const readingScore = (testResults[1].comprehensionScore * 0.5) + (speedScore * 0.5);
      scores.push(readingScore);
    }

    if (testResults[2]) {
      // Word recognition score
      scores.push(testResults[2].accuracy);
    }

    if (testResults[3]) {
      // Letter reversal score
      scores.push(testResults[3].accuracy);
    }

    return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b) / scores.length) : 0;
  };

  const renderProgressBar = (label, value, color) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body1">{label}</Typography>
        <Typography variant="body1">{Math.round(value)}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 10,
          borderRadius: 5,
          '& .MuiLinearProgress-bar': {
            backgroundColor: color || (
              value > 80 ? '#4caf50' :
              value > 60 ? '#ff9800' : '#f44336'
            )
          }
        }}
      />
    </Box>
  );

  const renderDetailedResults = () => {
    return (
      <Grid container spacing={3}>
        {/* Voice Reading Test Results */}
        {testResults[0] && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Voice Reading Analysis
                </Typography>
                {testResults[0].assessment ? (
                  <>
                    {renderProgressBar(
                      'Dyslexia Assessment Score',
                      100 - testResults[0].assessment.score,
                      testResults[0].assessment.score < 20 ? '#4caf50' :
                      testResults[0].assessment.score < 40 ? '#8bc34a' :
                      testResults[0].assessment.score < 60 ? '#ff9800' : '#f44336'
                    )}
                    <Alert severity={testResults[0].assessment.color} sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>{testResults[0].assessment.likelihood} Likelihood: </strong>
                        {testResults[0].assessment.message}
                      </Typography>
                    </Alert>
                  </>
                ) : null}
                
                {renderProgressBar('Reading Accuracy', testResults[0].accuracy || 0)}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Reading Speed: {testResults[0].wordsPerMinute || 0} words per minute
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Hesitations Detected: {testResults[0].hesitations || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Pronunciation Errors: {testResults[0].pronunciationErrors || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Word Repetitions: {testResults[0].repetitions || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Dyslexic Patterns: {testResults[0].dyslexicPatterns || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Time Spent: {Math.round(testResults[0].timeSpent || 0)} seconds
                  </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Original Text:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {testResults[0].originalText}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Your Reading:
                  </Typography>
                  <Typography variant="body2">
                    {testResults[0].spokenText}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Reading Test Results */}
        {testResults[1] && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Reading Test Results
                </Typography>
                {renderProgressBar('Comprehension', testResults[1].comprehensionScore)}
                <Typography variant="body2" color="text.secondary">
                  Reading Speed: {testResults[1].readingSpeedWPM} words per minute
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Spent: {Math.round(testResults[1].readingTime)} seconds
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Word Recognition Results */}
        {testResults[2] && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Word Recognition Results
                </Typography>
                {renderProgressBar('Accuracy', testResults[2].accuracy)}
                <Typography variant="body2" color="text.secondary">
                  Average Response Time: {Math.round(testResults[2].averageResponseTime)} ms
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct Answers: {testResults[2].totalCorrect} out of {testResults[2].totalQuestions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Letter Reversal Results */}
        {testResults[3] && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Letter Reversal Results
                </Typography>
                {renderProgressBar('Accuracy', testResults[3].accuracy)}
                <Typography variant="body2" color="text.secondary">
                  Total Time: {Math.round(testResults[3].totalTime)} seconds
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct Answers: {testResults[3].totalCorrect} out of {testResults[3].totalQuestions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    );
  };

  const overallScore = calculateOverallScore();

  return (
    <Container>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Assessment Results
        </Typography>
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h6" gutterBottom>
            Overall Score: {overallScore}%
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Based on your performance across all tests
          </Typography>
          {renderProgressBar('Overall Performance', overallScore)}
        </Box>

        {renderDetailedResults()}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recommendations
          </Typography>
          <Typography paragraph>
            Based on your results, here are some recommendations:
          </Typography>
          <ul>
            {overallScore < 70 && (
              <>
                <li>Consider consulting with a dyslexia specialist for a professional evaluation</li>
                <li>Practice reading aloud regularly to improve fluency</li>
                <li>Use a reading guide or ruler to help track lines of text</li>
                <li>Take breaks during long reading sessions to maintain focus</li>
              </>
            )}
            {overallScore >= 70 && overallScore < 85 && (
              <>
                <li>Continue practicing reading regularly</li>
                <li>Focus on challenging words and letter combinations</li>
                <li>Consider using reading assistance tools when needed</li>
              </>
            )}
            {overallScore >= 85 && (
              <>
                <li>Your performance is strong! Continue your current reading practices</li>
                <li>Challenge yourself with more complex reading materials</li>
              </>
            )}
          </ul>
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/assessment')}
          >
            Retake Assessment
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Results; 