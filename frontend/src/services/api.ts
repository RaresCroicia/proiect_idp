import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
};

// Course endpoints
export const courseApi = {
  getAllCourses: () => api.get('/courses'),
  getCourseById: (id: string) => api.get(`/courses/${id}`),
  enrollUser: (courseId: string, userId: string) =>
    api.post(`/courses/${courseId}/enroll`, { userId }),
  unenrollUser: (courseId: string, userId: string) =>
    api.post(`/courses/${courseId}/unenroll`, { userId }),
  getLesson: (courseId: string, lessonId: string) =>
    api.get(`/courses/${courseId}/lessons/${lessonId}`),
  submitQuiz: (
    courseId: string,
    lessonId: string,
    quizId: string,
    userId: string,
    answers: number[]
  ) =>
    api.post(`/courses/${courseId}/lessons/${lessonId}/quizzes/${quizId}/submit`, {
      userId,
      answers,
    }),
};

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 