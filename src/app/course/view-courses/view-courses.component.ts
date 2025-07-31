import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Course } from 'src/Models/course.model';

@Component({
  selector: 'app-view-courses',
  templateUrl: './view-courses.component.html',
  styleUrls: ['./view-courses.component.scss']
})
export class ViewCoursesComponent implements OnInit {

  courses: Course[] = [];
    studentId?: number;
  
    constructor(private apiSvc: ApiService, private authSvc: AuthService) {
      this.studentId = Number(this.authSvc.getId());
    }
  
    ngOnInit() {
      this.apiSvc.getAllCourses(this.studentId!).subscribe((res:any) => {
        console.log("ResL",res);
        this.courses = res;
      });
    }

}
