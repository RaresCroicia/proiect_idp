import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { courseService, Lesson, Quiz, QuizResult } from '../services/course.service';

const LessonDetail = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!courseId || !lessonId) return;

      try {
        const course = await courseService.getCourseById(courseId);
        const lessonData = course.lessons.find(l => l.id === lessonId);
        if (lessonData) {
          setLesson(lessonData);
        } else {
          setError('Lesson not found');
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        setError('Failed to load lesson. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: parseInt(value),
    }));
  };

  const handleQuizSubmit = async () => {
    if (!lesson?.quizzes[0] || !courseId || !lessonId) return;

    try {
      const result = await courseService.submitQuiz(
        courseId,
        lessonId,
        lesson.quizzes[0].id,
        {
          userId: 'current-user-id', // TODO: Get actual user ID from auth context
          answers: Object.values(answers)
        }
      );
      setQuizResult(result);
      setQuizSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz. Please try again later.');
    }
  };

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

  if (!lesson) {
    return (
      <Typography variant="h5" color="error" align="center">
        Lesson not found
      </Typography>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {lesson.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {lesson.content}
        </Typography>

        {lesson.quizzes.length > 0 && !showQuiz && !quizSubmitted && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowQuiz(true)}
            sx={{ mt: 2 }}
          >
            Take Quiz
          </Button>
        )}

        {showQuiz && !quizSubmitted && lesson.quizzes[0] && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Quiz: {lesson.quizzes[0].title}
            </Typography>
            <FormControl component="fieldset">
              {lesson.quizzes[0].questions.map((question, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. {question.question}
                  </Typography>
                  <RadioGroup
                    value={answers[index]?.toString() || ''}
                    onChange={(e) => handleAnswerChange(index.toString(), e.target.value)}
                  >
                    {question.options.map((option, optionIndex) => (
                      <FormControlLabel
                        key={optionIndex}
                        value={optionIndex.toString()}
                        control={<Radio />}
                        label={option}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ))}
              <Button
                variant="contained"
                color="primary"
                onClick={handleQuizSubmit}
                sx={{ mt: 2 }}
              >
                Submit Quiz
              </Button>
            </FormControl>
          </Box>
        )}

        {quizSubmitted && quizResult && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Quiz Results
            </Typography>
            <Typography variant="h6" color={quizResult.passed ? 'success.main' : 'error.main'}>
              Score: {quizResult.score}%
              {quizResult.passed ? (
                <CheckCircleIcon sx={{ ml: 1, verticalAlign: 'middle' }} />
              ) : null}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {quizResult.passed
                ? 'Congratulations! You passed the quiz.'
                : 'You did not pass the quiz. Please try again.'}
            </Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          Next Lesson
        </Button>
      </Box>
    </Box>
  );
};

export default LessonDetail; 