import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginData = { email: '', password: '' };


  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private apiSvc: ApiService,
    private toastSvc: ToastrService
  ) {}

  onLogin() {
    this.apiSvc.login(this.loginData).subscribe({
      next: (res:any) => {
        this.auth.setToken(res.token);
        const role = res.role;
        this.router.navigate(['/dashboard']);
        
      },
      error: () => this.toastSvc.error('Login failed')
    });
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } 
  }

}
