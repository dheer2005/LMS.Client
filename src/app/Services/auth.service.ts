import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'Lms_token';

  constructor() { }

  setToken(token: string){
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
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
