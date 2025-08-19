import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentDTO } from 'DTOs/paymentDto.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // ApiUrl: string = 'https://localhost:7071/api/';
  ApiUrl: string = 'https://SmartLms.bsite.net/api/';

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

  isEnrolled(studentId: number, courseId: number){
    return this.http.get(`${this.ApiUrl}Course/isEnrolled/${studentId}/${courseId}`)
  }

  // Video
  uploadVideo(data: FormData) {
    return this.http.post(`${this.ApiUrl}Video/upload`, data);
  }

  getCourseVideos(courseId: number) {
    return this.http.get<any[]>(`${this.ApiUrl}Video/by-course/${courseId}`);
  }

  trackVideoWatch(payload: any) {
    return this.http.post(`${this.ApiUrl}Video/track`, payload);
  }

  // Quiz
  createQuiz(data: any) {
    return this.http.post(`${this.ApiUrl}Quiz/create`, data);
  }

  addQuestionToQuiz(payload: any) {
    return this.http.post(`${this.ApiUrl}Quiz/add-question`, payload);
  }

  getQuizzesByCourse(studentId: number,courseId: number) {
    return this.http.get(`${this.ApiUrl}Quiz/course/${courseId}/${studentId}`);
  }

  getQuizDetails(quizId: number, userId: number) {
    return this.http.get(`${this.ApiUrl}Quiz/attempt/${quizId}/${userId}`);
  }

  submitQuizAnswers(payload: any) {
    return this.http.post(`${this.ApiUrl}Quiz/submit`, payload);
  }

  quizSubmission(payload: any){
    return this.http.post(`${this.ApiUrl}Quiz/quizSubmission`, payload);
  }

  getQuizResults(quizId:number){
    return this.http.get(`${this.ApiUrl}Quiz/results/${quizId}`);
  }

  //payment
  createOrder(amount:number){
    return this.http.post(`${this.ApiUrl}Payment/createOrder`, { amount });
  }

  verifyPayment(obj:any){
    return this.http.post(`${this.ApiUrl}Payment/verify-payment`, obj);
  }

  savePayment(dto: PaymentDTO){
    return this.http.post(`${this.ApiUrl}Payment/save-payment`, dto);
  }

  enrollCourse(data: any){
    return this.http.post(`${this.ApiUrl}Course/enroll`, data);
  }

  //Admin
  getAllUser(){
    return this.http.get(`${this.ApiUrl}Admin/GetAllUsers`);
  }

  deleteUser(userId: number){
    return this.http.delete(`${this.ApiUrl}Admin/deleteUser/${userId}`);
  }

  updateUser(userId: number, payload: any) {
    return this.http.put(`${this.ApiUrl}Admin/updateUser/${userId}`, payload);
  }

  getMyProgress(studentId: number) {
    return this.http.get<any[]>(`${this.ApiUrl}StudentProgress/progress/${studentId}`);
  }

  getPasswordLength(){
    return this.http.get(`${this.ApiUrl}Admin/getPasswordLength`);
  }

  //email verification
  SendEmail(data:any){
    return this.http.post(`${this.ApiUrl}Auth/SendEmail`, data);
  }

  verifyUser(user:any, data:any){
    return this.http.get(`${this.ApiUrl}Auth/verify/${user}/${data}`);
  }

  getSystemSetting(){
    return this.http.get(`${this.ApiUrl}Admin/get-systemSetting`);
  }

  AlreadyExists(data:any){
    return this.http.post(`${this.ApiUrl}Auth/AlreadyExists`, data);
  }


}
