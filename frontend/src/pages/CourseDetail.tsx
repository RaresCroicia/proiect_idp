import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Paper,
  Divider,
  CircularProgress,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import QuizIcon from '@mui/icons-material/Quiz';
import { courseApi } from '../services/api';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  hasQuiz: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: string;
  lessons: Lesson[];
}

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        const response = await courseApi.getCourseById(courseId);
        setCourse(response.data);
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!course) {
    return (
      <Typography variant="h5" color="error" align="center">
        Course not found
      </Typography>
    );
  }

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          mb: 4,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${course.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {course.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="subtitle1">Duration: {course.duration}</Typography>
          <Typography variant="subtitle1">Level: {course.level}</Typography>
        </Box>
      </Paper>

      <Typography variant="h4" gutterBottom>
        Course Content
      </Typography>
      <List>
        {course.lessons.map((lesson) => (
          <Box key={lesson.id}>
            {lesson.id !== course.lessons[0].id && <Divider />}
            <ListItem
              sx={{ py: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
            >
              <ListItemIcon>
                {lesson.hasQuiz ? <QuizIcon color="primary" /> : <PlayCircleOutlineIcon />}
              </ListItemIcon>
              <ListItemText
                primary={lesson.title}
                secondary={`Duration: ${lesson.duration}`}
              />
            </ListItem>
          </Box>
        ))}
      </List>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(`/courses/${courseId}/lessons/${course.lessons[0].id}`)}
        >
          Start Learning
        </Button>
      </Box>
    </Box>
  );
};

export default CourseDetail; 