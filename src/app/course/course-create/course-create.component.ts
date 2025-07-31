import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Course } from 'src/Models/course.model';

@Component({
  selector: 'app-course-create',
  templateUrl: './course-create.component.html',
  styleUrls: ['./course-create.component.scss']
})
export class CourseCreateComponent implements OnInit {

  course: Course = {title: '', description: '', teacherId: 0, thumbnailPath: ''};
  selectedThumbnailFile: File | null = null;

  constructor(private apiSvc: ApiService, private authSvc: AuthService, private toastSvc: ToastrService) {
    this.course.teacherId = Number(this.authSvc.getId());
  }

  onThumbnailSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0){
      this.selectedThumbnailFile = input.files[0];
    }
  }

  createCourse() {
    const formData = new FormData();
    formData.append('title', this.course.title);
    formData.append('description', this.course.description);
    formData.append('teacherId', this.course.teacherId!.toString());
    if (this.selectedThumbnailFile) {
      formData.append('thumbnail', this.selectedThumbnailFile);
    }

    this.apiSvc.createCourse(formData).subscribe({
      next: () => {
        this.toastSvc.success('✅ Course created!', 'Course')
        this.course = { title: '', description: '', teacherId: this.course.teacherId, thumbnailPath: '' };
        this.selectedThumbnailFile = null;
      },
      error: () => this.toastSvc.error('❌ Failed')
    });
  }

  ngOnInit(): void {
  }

}
