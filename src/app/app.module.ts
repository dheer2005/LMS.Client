import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseListComponent } from './course/course-list/course-list.component';
import { CourseCreateComponent } from './course/course-create/course-create.component';
import { VideoUploadComponent } from './course/video-upload/video-upload.component';
import { ViewCoursesComponent } from './course/view-courses/view-courses.component';
import { RouterModule } from '@angular/router';
import { CourseOverviewComponent } from './course/course-overview/course-overview.component';
import { AddQuizComponent } from './Quiz/add-quiz/add-quiz.component';
import { QuizDetailComponent } from './Quiz/quiz-detail/quiz-detail.component';
import { AddQuestionComponent } from './Quiz/add-question/add-question.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    CourseListComponent,
    CourseCreateComponent,
    VideoUploadComponent,
    ViewCoursesComponent,
    CourseOverviewComponent,
    AddQuizComponent,
    QuizDetailComponent,
    AddQuestionComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
