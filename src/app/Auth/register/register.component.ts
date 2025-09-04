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

  registerData = { fullName: '', email: '', isEmailVerified: false, password: '', signature: ' ', role: 'Student' };
  
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
      const form = new FormData();
      form.append('fullName', this.registerData.fullName);
      form.append('email', this.registerData.email);
      form.append('isEmailVerified', this.registerData.isEmailVerified.toString());
      form.append('password', this.registerData.password);
      form.append('role', this.registerData.role); 
      // form.append('signature', this.registerData.signature);
      this.apiSvc.AlreadyExists(form).subscribe({
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
              this.router.navigateByUrl('/verify', {state:{registerObj: {
                    ...this.registerData,
                    signature: ''
                  }, formReg: true, emailObj: this.email}});
              this.toastSvc.success("Email verification code sent successfully");
            },
            error: (err:any)=>{
              console.log("send email",err);
              this.processing = false;
              this.toastSvc.warning(err.error.message, 'Email');
            }
          });
        },
        error: (err:any)=>{
          console.log("already exist",err);
          this.processing = false;
          this.toastSvc.warning(err.error.message);
        }
      })
    }else{
      const form = new FormData();
      form.append('fullName', this.registerData.fullName);
      form.append('email', this.registerData.email);
      form.append('isEmailVerified', this.registerData.isEmailVerified.toString());
      form.append('password', this.registerData.password);
      form.append('signature', this.registerData.signature);
      form.append('role', this.registerData.role); 
      this.apiSvc.register(form).subscribe({
        next: (res:any) => {
          this.processing = false;
          this.toastSvc.success('Registered successfully', 'Registered');
          this.router.navigate(['/login']);
        },
        error: (err:any) => {
          this.processing = false;
          console.log(err);
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
