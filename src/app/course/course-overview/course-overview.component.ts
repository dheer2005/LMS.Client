import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private authSvc: AuthService) {
    this.userRole = this.authSvc.getRole();
  }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.params['id'];

    this.api.getCourseOverview(this.courseId).subscribe((res: any) => {
      this.course = res;
      this.videos = res.videos;

      if (this.videos.length > 0) {
        this.setSelectedVideo(this.videos[0]);
      }
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

  playPreview(video: any, event: MouseEvent) {
    video.hover = true;

    setTimeout(() => {
      const container = event.target as HTMLElement;
      const videoElement = container.querySelector('video') as HTMLVideoElement;

      if (videoElement) {
        videoElement.muted = true;

        const playAttempt = () => {
          videoElement.play().catch((err) => {
            console.warn('Autoplay blocked:', err);
          });
        };

        if (videoElement.readyState >= 2) {
          playAttempt();
        } else {
          videoElement.onloadeddata = () => {
            playAttempt();
          };
        }
      }
    }, 100);
  }


  pausePreview(video: any, event: MouseEvent) {
    video.hover = false;

    setTimeout(() => {
      const videoElement = (event.target as HTMLElement).querySelector('video') as HTMLVideoElement;
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }
    }, 50);
  }

}
