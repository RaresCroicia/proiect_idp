import { Box, Typography, Button, Grid as MuiGrid, Paper, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import QuizIcon from '@mui/icons-material/Quiz';

const Grid = MuiGrid as any; // Temporary type assertion to fix build

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Learning Platform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Expand your knowledge with our comprehensive online courses
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/courses')}
          sx={{ mt: 2 }}
        >
          Browse Courses
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <SchoolIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" gutterBottom>
              Expert-Led Courses
            </Typography>
            <Typography color="text.secondary">
              Learn from industry professionals and gain practical skills
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <LibraryBooksIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" gutterBottom>
              Comprehensive Content
            </Typography>
            <Typography color="text.secondary">
              Access high-quality video lessons and learning materials
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <QuizIcon sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
            <Typography variant="h5" gutterBottom>
              Interactive Quizzes
            </Typography>
            <Typography color="text.secondary">
              Test your knowledge and track your progress with quizzes
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ padding: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Browse Courses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore our wide range of courses and start learning today.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/courses')}
                sx={{ mt: 2 }}
              >
                View Courses
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                My Learning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your progress and continue where you left off.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/my-courses')}
                sx={{ mt: 2 }}
              >
                Go to My Courses
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Create Course
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Share your knowledge by creating your own course.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/create-course')}
                sx={{ mt: 2 }}
              >
                Start Creating
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home; 