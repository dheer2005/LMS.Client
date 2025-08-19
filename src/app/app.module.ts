import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ManageUsersComponent } from './Admin/manage-users/manage-users.component';
import { SystemSettingComponent } from './Admin/system-setting/system-setting.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MyProgressComponent } from './my-progress/my-progress.component';
import { EmailVerificationComponent } from './Auth/email-verification/email-verification.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { DoubtComponent } from './course/doubt/doubt.component';
import { QuizResultListComponent } from './Quiz/quiz-result-list/quiz-result-list.component';
import { QuizResultDetailComponent } from './Quiz/quiz-result-detail/quiz-result-detail.component';
import { CertificateComponent } from './course/certificate/certificate.component';
import { VerifyCertificateComponent } from './course/verify-certificate/verify-certificate.component';

export function tokenGetter() {
  return localStorage.getItem('Lms_token'); 
}

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
    AddQuestionComponent,
    ManageUsersComponent,
    SystemSettingComponent,
    MyProgressComponent,
    EmailVerificationComponent,
    PagenotfoundComponent,
    DoubtComponent,
    QuizResultListComponent,
    QuizResultDetailComponent,
    CertificateComponent,
    VerifyCertificateComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:7071'],
        disallowedRoutes: [
          'http://localhost:7071/api/auth/login',
          'http://localhost:7071/api/auth/register',
        ]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
