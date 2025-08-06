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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'create-course', component: CourseCreateComponent },
  { path: 'my-courses', component: CourseListComponent },
  { path: 'upload-video/:id', component: VideoUploadComponent },
  { path: 'view-courses', component: ViewCoursesComponent },
  { path: 'course-overview/:id', component: CourseOverviewComponent },
  { path: 'add-quiz/:id', component: AddQuizComponent },
  { path: 'quiz-detail/:id', component: QuizDetailComponent },
  { path: 'add-question/:quizId', component: AddQuestionComponent },
  { path: 'manage-users', component: ManageUsersComponent },
  { path: 'settings', component: SystemSettingComponent},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
