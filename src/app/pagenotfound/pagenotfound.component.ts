import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.scss']
})
export class PagenotfoundComponent implements OnInit {
  userLoggedIn: any;
  constructor(private authSvc: AuthService, private router: Router) {
    this.userLoggedIn = this.authSvc.isLoggedIn();
  }
  ngOnInit(): void {
  }

  goHome(){
    if(this.userLoggedIn){
      this.router.navigateByUrl('dashboard');
    }else{
      this.router.navigateByUrl('login');
    }

  }

}
