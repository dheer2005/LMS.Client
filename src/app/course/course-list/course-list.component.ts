import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Course } from 'src/Models/course.model';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  courses: any[] = [];
  teacherId?: number;

  constructor(private apiSvc: ApiService, private router: Router, private authSvc: AuthService, private toastSvc: ToastrService) {
    this.teacherId = Number(this.authSvc.getId());
  }

  ngOnInit() {
    this.apiSvc.getMyCourses(this.teacherId!).subscribe((res:any) => {
      this.courses = res;
    });
  }

  toggleExpand(course: any): void {
    course.expanded = !course.expanded;
  }

  goToUpload(courseId: number) {
    this.router.navigate(['/upload-video', courseId]);
  }
}
