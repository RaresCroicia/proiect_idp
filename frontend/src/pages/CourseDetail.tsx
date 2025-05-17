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
import { courseService, Course, Lesson } from '../services/course.service';

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
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${course.imageUrl || '/default-course.jpg'})`,
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
                {lesson.quizzes.length > 0 ? <QuizIcon color="primary" /> : <PlayCircleOutlineIcon />}
              </ListItemIcon>
              <ListItemText
                primary={lesson.title}
                secondary={`Order: ${lesson.order}`}
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