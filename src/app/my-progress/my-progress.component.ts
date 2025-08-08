import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { ApiService } from '../Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-progress',
  templateUrl: './my-progress.component.html',
  styleUrls: ['./my-progress.component.scss']
})
export class MyProgressComponent implements OnInit {
  studentId?: number;
  progressData: any[] = [];

  constructor(private authSvc: AuthService, private apiSvc: ApiService, private toastrSvc: ToastrService) {
    this.studentId = Number(this.authSvc.getId());
  }

  ngOnInit(): void {
    this.apiSvc.getMyProgress(this.studentId!).subscribe({
      next: (res:any)=>{
        this.progressData = res;
        console.log(this.progressData);
      },
      error: (err:any)=>{
        this.toastrSvc.warning(err.error.message, 'Failed to fetch data');
      }
    })
  }


}
