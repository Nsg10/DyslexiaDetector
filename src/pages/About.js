import React from 'react';
import {
  Typography,
  Container,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

function About() {
  return (
    <Container>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          About Dyslexia Detection Tool
        </Typography>
        
        <Typography variant="body1" paragraph>
          The Dyslexia Detection Tool is designed to help identify potential signs of dyslexia
          through a series of interactive assessments. While this tool is not a substitute for
          professional diagnosis, it can provide valuable insights and help determine if
          further professional evaluation is recommended.
        </Typography>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Assessment Areas
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Reading Speed
                  </Typography>
                  <Typography variant="body2">
                    Measures reading speed and fluency through timed reading exercises.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Word Recognition
                  </Typography>
                  <Typography variant="body2">
                    Evaluates ability to recognize and differentiate between similar words.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Letter Reversal
                  </Typography>
                  <Typography variant="body2">
                    Tests for common letter reversals and orientation confusion.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Important Note
          </Typography>
          <Typography variant="body1" paragraph>
            This tool is designed for screening purposes only and should not be used as a
            definitive diagnosis. If you suspect you or someone you know has dyslexia,
            please consult with a qualified educational psychologist or learning specialist.
          </Typography>
        </Box>

        <Box sx={{ my: 4 }}>
          <Typography variant="h5" gutterBottom>
            Resources
          </Typography>
          <Typography variant="body1">
            For more information about dyslexia, please visit:
          </Typography>
          <ul>
            <li>International Dyslexia Association</li>
            <li>National Center for Learning Disabilities</li>
            <li>Reading Rockets</li>
            <li>Understood.org</li>
          </ul>
        </Box>
      </Paper>
    </Container>
  );
}

export default About; 