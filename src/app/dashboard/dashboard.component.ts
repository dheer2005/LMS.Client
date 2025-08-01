import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  role: string = '';
  fullname: string = '';
  teacherId: number;
  myCourses: any[] = [];
  quizTitle: string = '';
  selectedCourseId!: number;

  constructor(private auth: AuthService, private router: Router, private apiSvc: ApiService) {
    this.teacherId = Number(this.auth.getId());
    this.apiSvc.getMyCourses(this.teacherId).subscribe({
      next: (res:any)=>{
        this.myCourses = res;
      }
    })
  }

  ngOnInit(): void {
    this.role = this.auth.getRole();
    this.fullname = this.auth.getName();
    if (!this.role) this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  createQuiz(courseId: number) {
    this.router.navigate(['/add-quiz', courseId]);
  }

}
