import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Dyslexia Detection Tool
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          An interactive tool to help identify potential signs of dyslexia
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/assessment')}
          sx={{ mt: 2 }}
        >
          Start Assessment
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Reading Assessment
              </Typography>
              <Typography variant="body1">
                Evaluate reading speed, accuracy, and comprehension through interactive exercises.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Visual Recognition
              </Typography>
              <Typography variant="body1">
                Test letter and word recognition abilities with various visual exercises.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Detailed Results
              </Typography>
              <Typography variant="body1">
                Get comprehensive analysis and recommendations based on your performance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home; 