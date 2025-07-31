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

    // Get course overview
    this.api.getCourseOverview(this.courseId).subscribe((res: any) => {
      this.course = res;
      console.log("CourseResponse:", this.course);
      this.videos = res.videos;
      if (this.videos.length > 0) {
        this.selectedVideo = this.videos[0]; 
      }
    });

    // Get quizzes separately
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

  playVideo(video: any) {
    this.selectedVideo = video;
  }

  addQuiz() {
    this.router.navigate(['/add-quiz', this.courseId]);
  }
}
