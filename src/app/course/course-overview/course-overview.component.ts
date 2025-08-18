import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { DoubtService } from 'src/app/Services/doubt.service';

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
  studentId?: number;
  studentName?: string;
  isEnrolled?: boolean;
  doubtTitle = '';
  doubtDescription = '';
  doubts: any[] = [];

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private authSvc: AuthService, private toastrSvc: ToastrService, private doubtService: DoubtService) {
    this.userRole = this.authSvc.getRole();
    this.studentName = this.authSvc.getName();
    this.studentId = Number(this.authSvc.getId());
  }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.params['id'];
    this.doubtService.startConnection(this.studentId!);

    this.doubtService.onReplyReceived().subscribe(reply => {
      const doubt = this.doubts.find(d => d.id === reply.doubtId);
      if (doubt) {
        // console.log("doubt replies:", doubt);
        if (!doubt.replies) {
          doubt.replies = [];
        }

        // Push reply with teacher object so template can show fullName
        doubt.replies.push({
          replyText: reply.replyText,
          teacher: {
            fullName: reply.teacherName 
          }
        });

        doubt.isResolved = true;
      }
    });

    if(this.userRole == "Student"){
      this.api.isEnrolled(this.studentId!,this.courseId).subscribe({
        next: (res)=>{
          if(!res){
            this.router.navigateByUrl('view-courses');
          }
        }
      });
    }

    this.api.getCourseOverview(this.courseId).subscribe((res: any) => {
      this.course = res;
      this.videos = res.videos;

      //Restore last selected video if still exists in this course
      const saved = localStorage.getItem('selectedVideo');
      if(saved){
        const parsed = JSON.parse(saved);
        if (parsed.courseId && parsed.courseId !== this.courseId) {
          localStorage.removeItem('selectedVideo');
        } else {
          const found = this.videos.find(v => v.id === parsed.id);
          if (found) {
            this.setSelectedVideo(found);
          }
        }
      }
    });

    this.api.getQuizzesByCourse(this.studentId!,this.courseId).subscribe((res: any) => {
      this.quizzes = res;
      console.log("quizzes", this.quizzes);

    });

    this.loadDoubts();
  }

  loadDoubts() {
    this.doubtService.getStudentDoubts(this.studentId!,this.courseId).subscribe((res: any) => {
      this.doubts = res;
    });
  }

  raiseDoubt() {
    if (!this.doubtTitle.trim() || !this.doubtDescription.trim()) {
      this.toastrSvc.warning('Please fill in both title and description.');
      return;
    }

    const doubt = {
      title: this.doubtTitle,
      description: this.doubtDescription,
      studentId: this.studentId,
      studentName: this.studentName,
      courseId: this.courseId
    };

    this.doubtService.raiseDoubt(doubt).subscribe(() => {
      this.toastrSvc.success('Doubt raised successfully.');
      this.doubtTitle = '';
      this.doubtDescription = '';
      this.loadDoubts();
    });
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
    localStorage.setItem('selectedVideo', JSON.stringify(this.selectedVideo));
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
        // this.toastrSvc.success(res.message);
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
