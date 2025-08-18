import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerData = { fullName: '', email: '', isEmailVerified: false, password: '', role: 'Student' };
  
  confirmPassword: string = '';
  showOtpForm = false;
  email = {
    emailTo: '',
    subject: '',
    body: '',
    userName:''
  }
  processing: boolean = false;

  requireEmailVerification?: boolean;

  otp:any;
  minPasswordLength: any;

  constructor(private http: HttpClient, private router: Router, private apiSvc: ApiService, private toastSvc: ToastrService, private authSvc: AuthService) {
    this.apiSvc.getPasswordLength().subscribe({
      next:(res:any)=>{
        this.minPasswordLength = res;
      }
    });
  }

  onRegister() {
    this.processing = true;
    if(this.requireEmailVerification){
      this.apiSvc.AlreadyExists(this.registerData).subscribe({
        next: (res:any)=>{
          this.email = {
            emailTo: this.registerData.email,
            subject: '',
            body: '',
            userName: this.registerData.fullName
          }
          this.apiSvc.SendEmail(this.email).subscribe({
            next: (data:any)=>{
              this.processing = false;
              this.router.navigateByUrl('/verify', {state:{registerObj: this.registerData, formReg: true, emailObj: this.email}});
              this.toastSvc.success("Email verification code sent successfully");
            },
            error: (err:any)=>{
              this.processing = false;
              this.toastSvc.warning(err.error.message, 'Email');
            }
          });
        },
        error: (err:any)=>{
          this.toastSvc.warning(err.error.message);
        }
      })
    }else{
      this.apiSvc.register(this.registerData).subscribe({
        next: (res:any) => {
          this.processing = false;
          this.toastSvc.success('Registered successfully', 'Registered');
          this.router.navigate(['/login']);
        },
        error: (err:any) => {
          this.processing = false;
          this.toastSvc.error(`${JSON.stringify(err.error.message)}`,'Registration failed');
        }
      });
    }

  }

  ngOnInit(): void {
    if(this.authSvc.isLoggedIn()){
      this.router.navigateByUrl('/dashboard');
    }
    this.apiSvc.getSystemSetting().subscribe({
      next: (res:any)=>{
        this.requireEmailVerification = res.requireEmailVerification;
      }
    })
  }

}
