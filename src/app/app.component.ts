import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from './Services/theme.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SystemSettingService } from './Services/system-setting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('rotateIcon', [
      state('light', style({ transform: 'rotate(0deg)' })),
      state('dark', style({ transform: 'rotate(180deg)' })),
      transition('light <=> dark', [animate('0.5s ease-in-out')]),
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'lms-client';
  role: string = '';
  teacherId: number;
  userName: string = '';
  currentTheme: 'light' | 'dark' = 'light';
  logoUrl: string = '';
  
  constructor(public authSvc: AuthService, private router: Router, private themeService: ThemeService, private settingSvc: SystemSettingService ){
    this.teacherId = Number(this.authSvc.getId());
    this.role = this.authSvc.getRole();
    this.userName = this.authSvc.getName();
  }

  ngOnInit() {
    this.settingSvc.getSettings().subscribe({
      next: (res)=>{
        this.logoUrl = res.logoUrl ;
      },
      error: (err: any)=>{
        console.log(err);
      }
    })
    this.settingSvc.logo$.subscribe(url => {
      this.logoUrl = url ;
    });
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
      document.body.className = '';
      if (this.currentTheme) {
        document.body.classList.add(this.currentTheme === 'dark'? 'dark-theme': 'empty');
      }
    });
    this.updateUserData();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUserData();
    });
  }


  updateUserData() {
    this.teacherId = Number(this.authSvc.getId());
    this.role = this.authSvc.getRole();
    this.userName = this.authSvc.getName();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }
}
