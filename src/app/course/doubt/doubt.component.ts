import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/Services/auth.service';
import { DoubtService } from 'src/app/Services/doubt.service';

@Component({
  selector: 'app-doubt',
  templateUrl: './doubt.component.html',
  styleUrls: ['./doubt.component.scss']
})
export class DoubtComponent implements OnInit {
  courseDoubts: any[] = [];
  teacherId = Number(this.authSvc.getId());
  teacherName = this.authSvc.getName();
  courseId?: number;
  selectedDoubt: any;
  replyContent?: string;
  showModal?: boolean;

  constructor(private route: ActivatedRoute, private authSvc: AuthService, private doubtService: DoubtService, private toastrSvc: ToastrService) { }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.params['id'];

    this.doubtService.startConnection(this.teacherId);

    this.doubtService.onDoubtReceived().subscribe(doubt => {
      if(doubt.studentName && !doubt.student){
        doubt.student = { fullName: doubt.studentName };
      }
      console.log("new doubt received:", doubt);
      this.toastrSvc.info(doubt.title, 'New doubt received');
      this.courseDoubts.unshift(doubt);
    });

    // Load existing doubts for course
    this.loadCourseDoubts(this.courseId);
  }

  openResolveModal(doubt: any) {
    this.selectedDoubt = doubt;
    this.replyContent = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  sendReply() {
    if(!this.replyContent?.trim()) return;
    const reply = {
      doubtId: this.selectedDoubt.id,
      teacherId: this.teacherId,
      teacherName: this.teacherName,
      replyText: this.replyContent,
      attachmentUrl: ''
    };

    this.doubtService.replyToDoubt(reply).subscribe(() => {
      this.toastrSvc.success('Reply sent.');
      this.loadCourseDoubts(this.courseId!);
      this.closeModal();
      this.replyContent = ''; 
    });
  }

  loadCourseDoubts(courseId: number){
    this.doubtService.getCourseDoubts(courseId).subscribe((data: any) => {
      this.courseDoubts = data.map((d:any)=>{
        if(d.studentName && ! d.student){
          d.student = {fullName: d.studentName};
        }
        return d;
      }).sort((a:any,b:any)=>{
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      console.log("doubts:", this.courseDoubts);
    });
  }


}
