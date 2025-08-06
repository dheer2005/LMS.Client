import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'Lms_token';

  constructor(private jwtHelper: JwtHelperService, private toastrSvc: ToastrService, private router: Router) { }

  setToken(token: string){
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  checkAuthentication(){
    const token = localStorage.getItem(this.tokenKey);
    if(token && !this.jwtHelper.isTokenExpired(token))
    {
      return true
    } else{
      if(token){
        this.toastrSvc.info('Token is expired');
        localStorage.removeItem(this.tokenKey);
        this.router.navigateByUrl('login');
      }
      return false;
    }
  }

  getRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const decoded: any = jwtDecode(token);
    return (
      decoded['role'] || ''
    );
  }

  getId(): string {
    const token = this.getToken();
    if (!token) return '';
    const decoded: any = jwtDecode(token);
    return (
      decoded['nameid'] || ''
    );
  }

  getName(): string {
    const token = this.getToken();
    if(!token) return '';
    const decoded: any = jwtDecode(token);
    return decoded['fullname']
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }


}
