import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { json } from 'stream/consumers';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerData = { fullName: '', email: '', password: '', role: 'Student' };
  showOtpForm = false;
  email = {
    emailTo: '',
    subject: '',
    body: '',
    userName:''
  }

  requireEmailVerification?: boolean;

  otp:any;

  constructor(private http: HttpClient, private router: Router, private apiSvc: ApiService, private toastSvc: ToastrService) {}

  onRegister() {
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
              this.router.navigateByUrl('/verify', {state:{registerObj: this.registerData, formReg: true}});
              this.toastSvc.success("Otp has sent to your registered mail");
            },
            error: (err:any)=>{
              this.toastSvc.warning("Something went wrong! retry after sometime");
            }
          });
        }
      })
    }else{
      this.apiSvc.register(this.registerData).subscribe({
        next: (res:any) => {
          this.toastSvc.success('Registered successfully', 'Registered');
          this.router.navigate(['/login']);
        },
        error: (err:any) => {
          // console.log(JSON.stringify(err.error));
          this.toastSvc.error(`${JSON.stringify(err.error.message)}`,'Registration failed');
        }
      });
    }

  }

  ngOnInit(): void {
    this.apiSvc.getSystemSetting().subscribe({
      next: (res:any)=>{
        this.requireEmailVerification = res.requireEmailVerification;
        console.log("requireemailverification", this.requireEmailVerification);
      }
    })
  }

}
