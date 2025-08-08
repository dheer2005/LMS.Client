import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-course-overview',
  templateUrl: './course-overview.component.html',
  styleUrls: ['./course-overview.component.scss']
})
export class CourseOverviewComponent implements OnInit {
  courseId!: number;
  course: any;
  videos: any[] = [];
  selectedVideo: any = null;
  quizzes: any[] = [];
  searchTerm: string = '';
  userRole: string = '';

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private authSvc: AuthService, private toastrSvc: ToastrService) {
    this.userRole = this.authSvc.getRole();
  }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.params['id'];

    this.api.getCourseOverview(this.courseId).subscribe((res: any) => {
      this.course = res;
      this.videos = res.videos;
    });

    this.api.getQuizzesByCourse(this.courseId).subscribe((res: any) => this.quizzes = res);
  }

  get filteredVideos(): any[] {
    if (!this.searchTerm.trim()) {
      return this.videos;
    }
    return this.videos.filter(video =>
      video.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  setSelectedVideo(video: any) {
    this.selectedVideo = {
      ...video,
      quality480: video.videoUrls?._480p,
      quality720: video.videoUrls?._720p,
      quality1080: video.videoUrls?._1080p,
      selectedQuality: video.videoUrls?._720p || video.videoUrls?._480p || video.videoUrls?._1080p
    };
  }

  playVideo(video: any) {
    this.setSelectedVideo(video);
    if(this.userRole == 'Student'){
      this.trackVideoWatch(video.id);
    }
  }

  trackVideoWatch(videoId: number){
    const payload = {
      studentId: Number(this.authSvc.getId()),
      courseId: this.courseId,
      videoId: videoId
    };

    this.api.trackVideoWatch(payload).subscribe({
      next: (res:any)=>{
        this.toastrSvc.success(res.message);
      },
      error: (err:any)=>{
        this.toastrSvc.warning('Failed to track video watch', err);
      }
    })
  }



  addQuiz() {
    this.router.navigate(['/add-quiz', this.courseId]);
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  changeQuality(qualityKey: string) {
    if (this.selectedVideo && this.selectedVideo[qualityKey]) {
      this.selectedVideo.selectedQuality = this.selectedVideo[qualityKey];
    }
  }
}
