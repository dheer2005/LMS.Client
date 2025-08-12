import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './Guards/auth.guard';
import { CourseCreateComponent } from './course/course-create/course-create.component';
import { CourseListComponent } from './course/course-list/course-list.component';
import { VideoUploadComponent } from './course/video-upload/video-upload.component';
import { ViewCoursesComponent } from './course/view-courses/view-courses.component';
import { CourseOverviewComponent } from './course/course-overview/course-overview.component';
import { AddQuizComponent } from './Quiz/add-quiz/add-quiz.component';
import { QuizDetailComponent } from './Quiz/quiz-detail/quiz-detail.component';
import { AddQuestionComponent } from './Quiz/add-question/add-question.component';
import { ManageUsersComponent } from './Admin/manage-users/manage-users.component';
import { SystemSettingComponent } from './Admin/system-setting/system-setting.component';
import { MyProgressComponent } from './my-progress/my-progress.component';
import { EmailVerificationComponent } from './Auth/email-verification/email-verification.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'create-course', component: CourseCreateComponent, canActivate: [AuthGuard] },
  { path: 'my-courses', component: CourseListComponent, canActivate: [AuthGuard] },
  { path: 'upload-video/:id', component: VideoUploadComponent, canActivate: [AuthGuard] },
  { path: 'view-courses', component: ViewCoursesComponent, canActivate: [AuthGuard] },
  { path: 'course-overview/:id', component: CourseOverviewComponent, canActivate: [AuthGuard] },
  { path: 'add-quiz/:id', component: AddQuizComponent, canActivate: [AuthGuard] },
  { path: 'quiz-detail/:id', component: QuizDetailComponent, canActivate: [AuthGuard] },
  { path: 'add-question/:quizId', component: AddQuestionComponent, canActivate: [AuthGuard] },
  { path: 'manage-users', component: ManageUsersComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SystemSettingComponent, canActivate: [AuthGuard]},
  { path: 'my-progress', component: MyProgressComponent, canActivate: [AuthGuard]},
  { path: 'verify', component: EmailVerificationComponent},
  { path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
