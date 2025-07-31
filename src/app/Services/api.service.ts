import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  ApiUrl: string = 'https://localhost:7071/api/';

  constructor(private http: HttpClient) { }

  // Auth
  login(data: any) {
    return this.http.post(`${this.ApiUrl}Auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.ApiUrl}Auth/register`, data);
  }

  // Course
  createCourse(courseData: FormData) {
    return this.http.post(`${this.ApiUrl}Course/create`, courseData);
  }

  getMyCourses(teacherId: number) {
    return this.http.get(`${this.ApiUrl}Course/my-courses/${teacherId}`);
  }

  getAllCourses(studentId: number) {
    return this.http.get(`${this.ApiUrl}Course/available-courses/${studentId}`);
  }

  getCourseOverview(courseId: number) {
    return this.http.get(`${this.ApiUrl}Video/overview/${courseId}`);
  }

  // Video
  uploadVideo(data: FormData) {
    return this.http.post(`${this.ApiUrl}Video/upload`, data);
  }

  getCourseVideos(courseId: number) {
    return this.http.get<any[]>(`${this.ApiUrl}Video/by-course/${courseId}`);
  }

  // Quiz
  createQuiz(data: any) {
    return this.http.post(`${this.ApiUrl}Quiz/create`, data);
  }

  addQuestionToQuiz(payload: any) {
    return this.http.post(`${this.ApiUrl}Quiz/add-question`, payload);
  }

  getQuizzesByCourse(courseId: number) {
    return this.http.get(`${this.ApiUrl}Quiz/course/${courseId}`);
  }

  getQuizDetails(quizId: number) {
    return this.http.get(`${this.ApiUrl}Quiz/attempt/${quizId}`);
  }

  submitQuizAnswers(payload: any) {
    return this.http.post(`${this.ApiUrl}Quiz/submit`, payload);
  }

}
