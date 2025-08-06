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

  constructor(private http: HttpClient, private router: Router, private apiSvc: ApiService, private toastSvc: ToastrService) {}

  onRegister() {
    this.apiSvc.register(this.registerData).subscribe({
      next: () => {
        this.toastSvc.success('Registered successfully', 'Registered');
        this.router.navigate(['/login']);
      },
      error: (err:any) => {
        // console.log(JSON.stringify(err.error));
        this.toastSvc.error(`${JSON.stringify(err.error.message)}`,'Registration failed');
      }
    });
  }

  ngOnInit(): void {
  }

}
