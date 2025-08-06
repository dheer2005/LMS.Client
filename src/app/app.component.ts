import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'lms-client';
  role: string = '';
  teacherId: number;
  userName: string = '';

  ngOnInit() {
    this.updateUserData();

    // 🔁 Listen for route changes (after login/logout)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUserData();
    });
  }

  constructor(public authSvc: AuthService, private router: Router){
    this.teacherId = Number(this.authSvc.getId());
    this.role = this.authSvc.getRole();
    this.userName = this.authSvc.getName();
  }

  updateUserData() {
    this.teacherId = Number(this.authSvc.getId());
    this.role = this.authSvc.getRole();
    this.userName = this.authSvc.getName();
  }

  logout() {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }
}
