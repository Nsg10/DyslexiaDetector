import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Stack,
} from '@mui/material';

// Common dyslexic patterns and their regular expressions
const DYSLEXIC_PATTERNS = {
  letterReversal: /\b([bdpq])[a-z]*\1\b/gi,
  wordReversals: /\b(on|no|was|saw|top|pot)\b/gi,
  commonConfusions: /\b(their|there|they're|where|were|weather|whether)\b/gi,
};

// Enhanced reading passage with specific dyslexia detection elements
const readingPassage = `
The big dog played in the park near the pond.
She saw six black cats dash past the red box.
The weather was perfect for their picnic there.
Peter picked a pack of fresh berries by the quiet stream.
The brave queen went to battle with her loyal knights.
`;

function VoiceReadingTest({ onComplete }) {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  
  // New state variables for real-time feedback
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [realtimeMetrics, setRealtimeMetrics] = useState({
    currentPace: 0,
    confidence: 0,
    lastWord: '',
    pronunciationScore: 100,
  });
  const [highlightedText, setHighlightedText] = useState([]);
  
  // New state variables for enhanced analysis
  const [readingMetrics, setReadingMetrics] = useState({
    accuracy: 0,
    hesitations: 0,
    pronunciationErrors: 0,
    rhythmScore: 0,
    repetitions: 0,
    dyslexicPatterns: 0,
    assessment: null
  });

  const calculateAccuracy = (original, spoken) => {
    if (!original?.length || !spoken?.length) return 0;
    const maxLength = Math.max(original.length, spoken.length);
    let matches = 0;

    for (let i = 0; i < maxLength; i++) {
      if (original[i]?.toLowerCase() === spoken[i]?.toLowerCase()) {
        matches++;
      }
    }

    return Math.round((matches / maxLength) * 100) || 0;
  };

  const countHesitations = (text) => {
    if (!text) return 0;
    return (text.match(/[.,!?]\s+|\s{2,}/g) || []).length;
  };

  const analyzePronunciationErrors = (words) => {
    if (!Array.isArray(words) || !words.length) return 0;
    return words.filter(word => {
      if (!word) return false;
      const normalized = word.toLowerCase();
      return normalized !== normalized.replace(/[aeiou]+/g, 'a');
    }).length;
  };

  const calculateRhythmScore = (text) => {
    if (!text) return 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    if (!sentences.length) return 0;
    
    const avgWordsPerSentence = sentences.reduce((acc, sent) => 
      acc + (sent.trim().split(/\s+/).length || 0), 0) / sentences.length;
    return Math.round(Math.min(100, Math.max(0, 100 - Math.abs(15 - avgWordsPerSentence) * 5))) || 0;
  };

  const countWordRepetitions = (words) => {
    if (!Array.isArray(words) || words.length < 2) return 0;
    let repetitions = 0;
    for (let i = 1; i < words.length; i++) {
      if (words[i] && words[i-1] && words[i].toLowerCase() === words[i - 1].toLowerCase()) {
        repetitions++;
      }
    }
    return repetitions;
  };

  const countDyslexicPatterns = (text) => {
    if (!text) return 0;
    let count = 0;
    Object.values(DYSLEXIC_PATTERNS).forEach(pattern => {
      count += (text.match(pattern) || []).length;
    });
    return count;
  };

  const assessTraditionalDyslexia = (metrics) => {
    // Log incoming metrics for debugging
    console.log('Incoming metrics:', metrics);

    // Ensure all metrics are valid numbers
    const validMetrics = {
      accuracy: isNaN(metrics.accuracy) ? 0 : Number(metrics.accuracy),
      hesitations: isNaN(metrics.hesitations) ? 0 : Number(metrics.hesitations),
      pronunciationErrors: isNaN(metrics.pronunciationErrors) ? 0 : Number(metrics.pronunciationErrors),
      repetitions: isNaN(metrics.repetitions) ? 0 : Number(metrics.repetitions),
      dyslexicPatterns: isNaN(metrics.dyslexicPatterns) ? 0 : Number(metrics.dyslexicPatterns)
    };

    // Log validated metrics
    console.log('Validated metrics:', validMetrics);

    // Calculate individual components
    const accuracyComponent = (1 - validMetrics.accuracy / 100) * 30;
    const hesitationsComponent = Math.min(validMetrics.hesitations, 10) / 10 * 20;
    const pronunciationComponent = Math.min(validMetrics.pronunciationErrors, 10) / 10 * 25;
    const repetitionsComponent = Math.min(validMetrics.repetitions, 5) / 5 * 15;
    const patternsComponent = Math.min(validMetrics.dyslexicPatterns, 5) / 5 * 10;

    // Log components
    console.log('Score components:', {
      accuracyComponent,
      hesitationsComponent,
      pronunciationComponent,
      repetitionsComponent,
      patternsComponent
    });

    // Calculate final score with validation
    const score = Math.round(
      accuracyComponent +
      hesitationsComponent +
      pronunciationComponent +
      repetitionsComponent +
      patternsComponent
    );

    // Ensure score is a valid number
    const finalScore = isNaN(score) ? 0 : Math.max(0, Math.min(100, score));

    console.log('Final score:', finalScore);

    // Return assessment based on validated score
    if (finalScore < 20) {
      return {
        likelihood: "Low",
        message: "No significant indicators of dyslexia detected.",
        confidence: "0.95",
        color: "success",
        score: finalScore,
        details: validMetrics
      };
    } else if (finalScore < 40) {
      return {
        likelihood: "Mild",
        message: "Some mild indicators of dyslexia present. Consider further assessment.",
        confidence: "0.85",
        color: "info",
        score: finalScore,
        details: validMetrics
      };
    } else if (finalScore < 60) {
      return {
        likelihood: "Moderate",
        message: "Moderate indicators of dyslexia detected. Professional assessment recommended.",
        confidence: "0.80",
        color: "warning",
        score: finalScore,
        details: validMetrics
      };
    } else {
      return {
        likelihood: "High",
        message: "Strong indicators of dyslexia present. Professional assessment recommended.",
        confidence: "0.90",
        color: "error",
        score: finalScore,
        details: validMetrics
      };
    }
  };

  const analyzeReading = useCallback(() => {
    try {
      const endTime = Date.now();
      const timeSpent = Math.max(1, (endTime - startTime) / 1000); // Prevent division by zero
      const originalWords = readingPassage.trim().split(/\s+/);
      const spokenWords = (spokenText || '').trim().split(/\s+/);

      console.log('Analysis starting with:', {
        timeSpent,
        originalWordCount: originalWords.length,
        spokenWordCount: spokenWords.length
      });

      const metrics = {
        wordsPerMinute: Math.round((spokenWords.length / timeSpent) * 60) || 0,
        accuracy: calculateAccuracy(originalWords, spokenWords),
        hesitations: countHesitations(spokenText),
        pronunciationErrors: analyzePronunciationErrors(spokenWords),
        rhythmScore: calculateRhythmScore(spokenText),
        repetitions: countWordRepetitions(spokenWords),
        dyslexicPatterns: countDyslexicPatterns(spokenText)
      };

      console.log('Calculated metrics:', metrics);

      const assessment = assessTraditionalDyslexia(metrics);

      console.log('Assessment result:', assessment);

      // Update the metrics state with assessment
      const updatedMetrics = {
        ...metrics,
        assessment
      };

      setReadingMetrics(updatedMetrics);

      // Pass complete result to parent
      const result = {
        ...metrics,
        timeSpent,
        originalText: readingPassage,
        spokenText: spokenText || '',
        assessment
      };

      onComplete(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Error analyzing reading: ' + error.message);
    }
  }, [startTime, spokenText, onComplete, readingPassage]);

  const startListening = useCallback(async () => {
    if (recognition) {
      try {
        // Request microphone permission explicitly
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately

        setSpokenText(''); // Clear previous text
        setDebugInfo('Starting recognition...');
        recognition.start();
        setIsListening(true);
        setStartTime(Date.now());
        setError(null);
      } catch (e) {
        setError('Microphone permission denied or error accessing microphone: ' + e.message);
        setDebugInfo('Microphone error: ' + e.message);
      }
    } else {
      setError('Speech recognition not initialized');
      setDebugInfo('Recognition not initialized');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.stop();
        setIsListening(false);
        setDebugInfo(prev => prev + '\nStopping recognition...');
        if (spokenText.trim()) {
          analyzeReading();
        } else {
          setError('No speech was detected. Please try again.');
        }
      } catch (e) {
        setError('Error stopping recognition: ' + e.message);
        setDebugInfo(prev => prev + '\nError stopping: ' + e.message);
      }
    }
  }, [recognition, spokenText, analyzeReading]);

  useEffect(() => {
    let recognitionInstance = null;

    try {
      if (typeof window !== 'undefined') {
        // Check if browser supports speech recognition
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
          setError('Speech recognition is not supported in your browser. Please try Chrome, Edge, or Safari.');
          setDebugInfo('No SpeechRecognition API available');
          return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionInstance = new SpeechRecognition();

        // Configure the recognition
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        // Event handlers
        recognitionInstance.onstart = () => {
          setDebugInfo('Recognition started');
          setIsListening(true);
        };

        recognitionInstance.onend = () => {
          setDebugInfo(prev => prev + '\nRecognition ended');
          setIsListening(false);
        };

        recognitionInstance.onresult = (event) => {
          try {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += transcript;
              } else {
                interimTranscript += transcript;
              }
            }

            const fullTranscript = finalTranscript + interimTranscript;
            setSpokenText(fullTranscript);
            updateRealtimeMetrics(fullTranscript, Boolean(finalTranscript));
            setDebugInfo(prev => prev + '\nReceived transcript: ' + fullTranscript.substring(0, 50) + '...');
          } catch (e) {
            setDebugInfo(prev => prev + '\nError processing result: ' + e.message);
          }
        };

        recognitionInstance.onerror = (event) => {
          setDebugInfo(prev => prev + '\nError occurred: ' + event.error);
          setError('Error with speech recognition: ' + event.error);
          setIsListening(false);
        };

        recognitionInstance.onnomatch = () => {
          setDebugInfo(prev => prev + '\nNo speech was recognized');
        };

        recognitionInstance.onaudiostart = () => {
          setDebugInfo(prev => prev + '\nAudio capturing started');
        };

        recognitionInstance.onaudioend = () => {
          setDebugInfo(prev => prev + '\nAudio capturing ended');
        };

        recognitionInstance.onsoundstart = () => {
          setDebugInfo(prev => prev + '\nSound detected');
        };

        recognitionInstance.onsoundend = () => {
          setDebugInfo(prev => prev + '\nSound ended');
        };

        recognitionInstance.onspeechstart = () => {
          setDebugInfo(prev => prev + '\nSpeech detected');
        };

        recognitionInstance.onspeechend = () => {
          setDebugInfo(prev => prev + '\nSpeech ended');
        };

        setRecognition(recognitionInstance);
        setDebugInfo('Recognition initialized');
      }
    } catch (e) {
      setError('Error initializing speech recognition: ' + e.message);
      setDebugInfo('Initialization error: ' + e.message);
    }

    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
    };
  }, []);

  // Initialize highlighted text
  useEffect(() => {
    const words = readingPassage.trim().split(/\s+/);
    setHighlightedText(words.map(word => ({ 
      word, 
      status: 'pending' 
    })));
    setCurrentWordIndex(-1);
  }, [readingPassage]);

  // Function to update real-time metrics
  const updateRealtimeMetrics = useCallback((transcript, isFinal) => {
    const words = transcript.trim().split(/\s+/);
    const currentWord = words[words.length - 1];
    const timeSinceStart = (Date.now() - startTime) / 1000;
    const wordsPerMinute = Math.round((words.length / timeSinceStart) * 60);

    // Update highlighted text
    const newHighlightedText = readingPassage.trim().split(/\s+/).map((word, index) => {
      const spokenWord = words[index];
      if (!spokenWord) {
        return { word, status: 'pending' };
      }
      const similarity = calculateWordSimilarity(
        spokenWord.toLowerCase(),
        word.toLowerCase()
      );
      return { 
        word, 
        status: similarity > 0.8 ? 'correct' : 'incorrect',
        similarity 
      };
    });

    setHighlightedText(newHighlightedText);
    setCurrentWordIndex(words.length - 1);

    const totalSimilarity = newHighlightedText.reduce((sum, item) => sum + (item.similarity || 0), 0);
    const wordCount = words.length;
    const averageConfidence = wordCount > 0 ? (totalSimilarity / wordCount) * 100 : 100;

    setRealtimeMetrics(prev => ({
      currentPace: wordsPerMinute,
      confidence: isFinal ? 100 : Math.min(100, Math.round(averageConfidence)),
      lastWord: currentWord,
      pronunciationScore: calculatePronunciationScore(currentWord),
    }));
  }, [startTime, readingPassage]);

  // Calculate word similarity (Levenshtein distance based)
  const calculateWordSimilarity = (word1, word2) => {
    if (!word1 || !word2) return 0;
    const matrix = Array(word1.length + 1).fill().map(() => Array(word2.length + 1).fill(0));
    
    for (let i = 0; i <= word1.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= word2.length; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= word1.length; i++) {
      for (let j = 1; j <= word2.length; j++) {
        const cost = word1[i - 1] === word2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    const maxLength = Math.max(word1.length, word2.length);
    return 1 - (matrix[word1.length][word2.length] / maxLength);
  };

  // Calculate pronunciation score
  const calculatePronunciationScore = (word) => {
    if (!word) return 100;
    // Simple pronunciation scoring based on common dyslexic patterns
    let score = 100;
    Object.entries(DYSLEXIC_PATTERNS).forEach(([_, pattern]) => {
      if (pattern.test(word)) score -= 20;
    });
    return Math.max(0, score);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Voice Reading Test
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Read the following passage aloud. Click "Start Reading" when you're ready to begin,
        and "Stop" when you're finished.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Real-time feedback metrics */}
      {isListening && (
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={`Pace: ${realtimeMetrics.currentPace} WPM`}
              color={realtimeMetrics.currentPace < 60 ? 'warning' : 'success'}
            />
            <Chip
              label={`Confidence: ${Math.round(realtimeMetrics.confidence)}%`}
              color={realtimeMetrics.confidence > 80 ? 'success' : 'warning'}
            />
            <Chip
              label={`Pronunciation: ${realtimeMetrics.pronunciationScore}%`}
              color={realtimeMetrics.pronunciationScore > 80 ? 'success' : 'warning'}
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={(currentWordIndex + 1) / highlightedText.length * 100}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Stack>
      )}

      <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          '& .word': {
            display: 'inline-block',
            padding: '2px 4px',
            borderRadius: 1,
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
            lineHeight: '1.8',
          },
          '& .pending': { backgroundColor: 'transparent' },
          '& .correct': { backgroundColor: '#c8e6c9' },
          '& .incorrect': { backgroundColor: '#ffcdd2' },
          '& .current': { 
            outline: '2px solid #2196f3',
            backgroundColor: '#e3f2fd',
          }
        }}>
          {readingPassage.split(/\s+/).map((word, index) => (
            <span
              key={index}
              className={`word ${highlightedText[index]?.status || 'pending'} ${index === currentWordIndex ? 'current' : ''}`}
            >
              {word}
            </span>
          ))}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color={isListening ? "error" : "primary"}
          onClick={isListening ? stopListening : startListening}
          disabled={!!error}
        >
          {isListening ? "Stop Reading" : "Start Reading"}
        </Button>
        {isListening && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Listening...
            </Typography>
          </Box>
        )}
      </Box>

      {spokenText && !isListening && (
        <>
          <Paper sx={{ mt: 3, p: 2, backgroundColor: '#e3f2fd' }}>
            <Typography variant="subtitle2" gutterBottom>
              Recognized Speech:
            </Typography>
            <Typography variant="body2">
              {spokenText}
            </Typography>
          </Paper>

          <Paper sx={{ mt: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Reading Assessment
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Overall Assessment Score</Typography>
              <LinearProgress 
                variant="determinate" 
                value={readingMetrics.assessment?.score || 0} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: (readingMetrics.assessment?.score || 0) < 20 ? '#4caf50' : 
                                   (readingMetrics.assessment?.score || 0) < 40 ? '#8bc34a' :
                                   (readingMetrics.assessment?.score || 0) < 60 ? '#ff9800' : '#f44336'
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Score: {(readingMetrics.assessment?.score || 0).toFixed(1)}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Reading Accuracy</Typography>
              <LinearProgress 
                variant="determinate" 
                value={readingMetrics.accuracy || 0} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: (readingMetrics.accuracy || 0) > 80 ? '#4caf50' : 
                                   (readingMetrics.accuracy || 0) > 60 ? '#ff9800' : '#f44336'
                  }
                }}
              />
              <Typography variant="body2" color="text.secondary">
                {(readingMetrics.accuracy || 0).toFixed(1)}%
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Assessment Result</Typography>
              <Alert severity={readingMetrics.assessment?.color || 'info'} sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>{readingMetrics.assessment?.likelihood || 'Unknown'} Likelihood: </strong>
                  {readingMetrics.assessment?.message || 'Assessment pending...'}
                </Typography>
              </Alert>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Detected Issues</Typography>
              <Typography variant="body2" color="text.secondary">
                • Words Per Minute: {readingMetrics.wordsPerMinute || 0}
                <br />
                • Hesitations: {readingMetrics.hesitations || 0}
                <br />
                • Pronunciation Errors: {readingMetrics.pronunciationErrors || 0}
                <br />
                • Word Repetitions: {readingMetrics.repetitions || 0}
                <br />
                • Dyslexic Patterns: {readingMetrics.dyslexicPatterns || 0}
              </Typography>
            </Box>
          </Paper>
        </>
      )}

      <Paper sx={{ mt: 3, p: 2, backgroundColor: '#fff3e0' }}>
        <Typography variant="subtitle2" gutterBottom>
          Debug Information:
        </Typography>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {debugInfo}
        </Typography>
      </Paper>
    </Box>
  );
}

export default VoiceReadingTest; 