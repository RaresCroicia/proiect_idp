import axios from 'axios';
import { Course } from '../types/course';

const API_URL = import.meta.env.VITE_COURSE_SERVICE_URL || 'http://localhost/courses';

export const getCourses = async (): Promise<Course[]> => {
  const response = await axios.get<Course[]>(API_URL);
  return response.data;
};

export const getCourse = async (id: number): Promise<Course> => {
  const response = await axios.get<Course>(`${API_URL}/${id}`);
  return response.data;
};

export const enrollInCourse = async (courseId: number): Promise<Course> => {
  const response = await axios.post<Course>(`${API_URL}/${courseId}/enroll`);
  return response.data;
};

export const unenrollFromCourse = async (courseId: number): Promise<Course> => {
  const response = await axios.post<Course>(`${API_URL}/${courseId}/unenroll`);
  return response.data;
}; 