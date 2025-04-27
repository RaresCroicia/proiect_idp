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
import { courseApi } from '../services/api';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  hasQuiz: boolean;
  quiz?: {
    id: string;
    questions: QuizQuestion[];
    passingScore: number;
  };
}

const LessonDetail = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!courseId || !lessonId) return;

      try {
        const response = await courseApi.getLesson(courseId, lessonId);
        setLesson(response.data);
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
    if (!lesson?.quiz || !courseId || !lessonId) return;

    try {
      const response = await courseApi.submitQuiz(
        courseId,
        lessonId,
        lesson.quiz.id,
        'current-user-id', // TODO: Get actual user ID from auth context
        Object.values(answers)
      );
      setScore(response.data.score);
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
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {lesson.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {lesson.content}
        </Typography>
        {lesson.videoUrl && (
          <Box sx={{ mb: 3 }}>
            <iframe
              width="100%"
              height="400"
              src={lesson.videoUrl}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        )}
      </Paper>

      {lesson.hasQuiz && !showQuiz && !quizSubmitted && (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setShowQuiz(true)}
            startIcon={<CheckCircleIcon />}
          >
            Take Quiz
          </Button>
        </Box>
      )}

      {showQuiz && lesson.quiz && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Quiz
          </Typography>
          <FormControl component="fieldset">
            {lesson.quiz.questions.map((question) => (
              <Box key={question.id} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {question.question}
                </Typography>
                <RadioGroup
                  value={answers[question.id]?.toString() || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                >
                  {question.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index.toString()}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
            <Button
              variant="contained"
              onClick={handleQuizSubmit}
              disabled={Object.keys(answers).length !== lesson.quiz?.questions.length}
            >
              Submit Quiz
            </Button>
          </FormControl>
        </Paper>
      )}

      {quizSubmitted && (
        <Alert
          severity={score >= (lesson.quiz?.passingScore || 0) ? 'success' : 'error'}
          sx={{ mb: 3 }}
        >
          Your score: {score}% -{' '}
          {score >= (lesson.quiz?.passingScore || 0)
            ? 'Congratulations! You passed the quiz.'
            : 'You need to score higher to pass.'}
        </Alert>
      )}

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