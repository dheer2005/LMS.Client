import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  role: string = this.auth.getRole();

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.role == 'Admin' && (
        (route.routeConfig?.path === "create-course") ||
        (route.routeConfig?.path === "my-courses") ||
        (route.routeConfig?.path === "upload-video/:id") ||
        (route.routeConfig?.path === "view-courses") ||
        (route.routeConfig?.path === "course-overview/:id") ||
        (route.routeConfig?.path === "add-quiz/:id") ||
        (route.routeConfig?.path === "quiz-detail/:id") ||
        (route.routeConfig?.path === "add-question/:quizId") ||
        (route.routeConfig?.path === "my-progress") ||
        (route.routeConfig?.path === "verify")
      )){
        this.router.navigateByUrl('dashboard');
        return false;
      }else if(this.role == 'Student' && (
        (route.routeConfig?.path === "create-course") ||
        (route.routeConfig?.path === "my-courses") ||
        (route.routeConfig?.path === "upload-video/:id") ||
        (route.routeConfig?.path === "course-overview/:id") ||
        (route.routeConfig?.path === "add-quiz/:id") ||
        (route.routeConfig?.path === "manage-users") ||
        (route.routeConfig?.path === "add-question/:quizId") ||
        (route.routeConfig?.path === "settings")
      )){
        this.router.navigateByUrl('dashboard');
        return false;
      }else if(this.role == "Teacher" && (
        (route.routeConfig?.path === "manage-users") ||
        (route.routeConfig?.path === "settings") ||
        (route.routeConfig?.path === "view-courses") ||
        (route.routeConfig?.path === "my-progress") 
      )){
        this.router.navigateByUrl('dashboard');
        return false;
      }

      if(this.auth.isLoggedIn() && this.auth.checkAuthentication()) 
      {
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
  }
}
