import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private apiSvc: ApiService, @Inject(PLATFORM_ID) private platformId:any, private toastrSvc: ToastrService){}

  formRegistration:any;
  register = { fullName: '', email: '', password: '', role: 'Student' };

  otp:any;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) { return; }
  }

  ngAfterViewInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.formRegistration = window.history.state?.formReg;
      this.register = window.history.state?.registerObj;

      if (!this.formRegistration) {
        this.router.navigateByUrl('register');
      }
    }
  }

  onSubmit(){
    this.apiSvc.verifyUser(this.register.fullName, this.otp).subscribe({
      next: (res:any)=>{
        this.apiSvc.register(this.register).subscribe({
          next: (data:any)=>{
            this.toastrSvc.success('User registered');
            this.router.navigateByUrl('login');
          },
          error: (err:any)=>{
            this.toastrSvc.warning(err.error.message);
          }
        })
      }
    })
  }

}
