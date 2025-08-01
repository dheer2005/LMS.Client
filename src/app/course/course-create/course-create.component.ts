import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  course: Course = {title: '', description: '', teacherId: 0 ,thumbnailPath: ''};
  selectedThumbnailFile: File | null = null;
  isCreating?: boolean;

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
    this.isCreating = true;
    const formData = new FormData();
    formData.append('title', this.course.title);
    formData.append('description', this.course.description);
    formData.append('teacherId', this.course.teacherId!.toString());
    formData.append('price',this.course.price!.toString());
    if (this.selectedThumbnailFile) {
      formData.append('thumbnail', this.selectedThumbnailFile);
    }

    this.apiSvc.createCourse(formData).subscribe({
      next: () => {
        this.isCreating = false;
        this.toastSvc.success('✅ Course created!', 'Course')
        this.course = { title: '', description: '', teacherId: this.course.teacherId ,thumbnailPath: '' };
        this.selectedThumbnailFile = null;

        if(this.fileInputRef){
          this.fileInputRef.nativeElement.value = '';
        }
      },
      error: () => this.toastSvc.error('❌ Failed')
    });
  }

  ngOnInit(): void {
  }

}
