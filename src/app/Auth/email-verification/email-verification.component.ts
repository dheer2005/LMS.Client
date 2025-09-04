import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit, AfterViewInit {

  constructor(private router: Router, private apiSvc: ApiService, @Inject(PLATFORM_ID) private platformId:any, private toastrSvc: ToastrService, private authSvc: AuthService){}

  formRegistration:any;
  isLoggedIn = this.authSvc.isLoggedIn();
  register = { fullName: '', email: '', isEmailVerified: false , password: '', signature: '' , role: 'Student' };
  email = { emailTo: '', subject: '', body: '', userName: '' }

  otp:any;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) { return; }
  }

  ngAfterViewInit(): void {
    if(isPlatformBrowser(this.platformId)){
      this.formRegistration = window.history.state?.formReg;
      this.register = window.history.state?.registerObj;
      this.email = window.history.state?.emailObj;

      if (!this.formRegistration) {
        this.router.navigateByUrl('dashboard');
      }
    }
  }

  onSubmit(){
    this.apiSvc.verifyUser(this.register.fullName, this.otp).subscribe({
      next: (res:any)=>{
        this.register = {
          ...this.register,
          isEmailVerified: true
        }
        const form = new FormData();
        form.append('fullName', this.register.fullName);
        form.append('email', this.register.email);
        form.append('isEmailVerified', this.register.isEmailVerified.toString());
        form.append('password', this.register.password);
        form.append('role', this.register.role);
        if (this.register.signature) {
          form.append('signature', this.register.signature);
        }
        this.apiSvc.register(form).subscribe({
          next: (data:any)=>{
            this.toastrSvc.success('User registered');
            if(this.isLoggedIn){
              this.router.navigateByUrl('manage-users');
            }else{
              this.router.navigateByUrl('login');
            }
          },
          error: (err:any)=>{
            this.toastrSvc.warning(err.error.message);
          }
        })
      },
      error: (err:any)=>{
        this.toastrSvc.warning(err.error.message);
      }
    });
  }

  resendOTP(){
    this.apiSvc.SendEmail(this.email).subscribe({
      next: (res:any)=>{
        this.toastrSvc.success("OTP has been sent to your mail");
      },
      error: (err:any)=>{
        this.toastrSvc.warning(err.error.message,"Email")
      }
    })
  }

}
