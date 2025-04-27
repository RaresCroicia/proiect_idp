import { useState, useEffect } from 'react';
import { Grid as MuiGrid, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types/course';
import { getCourses } from '../services/courseService';

const Grid = MuiGrid as any; // Temporary type assertion to fix build

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course.id}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={course.imageUrl}
              alt={course.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {course.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {course.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: ${course.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rating: {course.rating}/5
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enrollments: {course.enrollments}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/courses/${course.id}`)}
                sx={{ mt: 2 }}
              >
                View Course
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
} 