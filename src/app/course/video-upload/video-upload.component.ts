import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  myCourses: any[] = [];
  selectedCourseId: number = 0;
  title: string = '';
  description: string = '';
  teacherId?: number;
  selectedFile: File | null = null;
  isUploading?: boolean;
  courseId?: number;
  isCoursePreselected?: boolean;

  constructor(private route: ActivatedRoute, private apiSvc: ApiService, private authSvc: AuthService, private toastSvc: ToastrService) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.paramMap.get('id')!;
    this.teacherId = Number(this.authSvc.getId());
    this.fetchMyCourses();

    if(this.courseId){
      this.selectedCourseId = this.courseId;
      this.isCoursePreselected = true;
    }
  }

  fetchMyCourses(): void {

    this.apiSvc.getMyCourses(this.teacherId!).subscribe({
      next: (courses:any) => this.myCourses = courses,
      error: () => this.toastSvc.error('❌ Failed to load your courses.')
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadVideo(): void {
    this.isUploading = true;
    if (!this.selectedCourseId) {
      this.toastSvc.warning('❌ Please select a course.');
      return;
    }

    if (!this.title.trim()) {
      this.toastSvc.warning('❌ Please enter a video title.');
      return;
    }

    if (!this.description) {
      this.toastSvc.warning('❌ Please enter a video title.');
      return;
    }

    if (!this.selectedFile) {
      this.toastSvc.warning('❌ Please select a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('courseId', this.selectedCourseId.toString());
    formData.append('file', this.selectedFile);
    formData.append('description', this.description);

    this.apiSvc.uploadVideo(formData).subscribe({
      next: () => {
        this.isUploading = false;
        this.toastSvc.success('✅ Video uploaded successfully!', 'Uploaded');
        this.title = '';
        if(!this.isCoursePreselected){
          this.selectedCourseId = 0;
        }
        this.selectedFile = null;
        this.description = '';
        if(this.fileInputRef){
          this.fileInputRef.nativeElement.value = '';
        }
      },
      error: (err:any) => {
        this.isUploading = false;
        this.toastSvc.error(`${JSON.stringify(err.error.message)}`,'❌ Upload failed.');
      }
    });
  }

}
