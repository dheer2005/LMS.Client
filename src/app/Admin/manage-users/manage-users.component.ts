import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Popover } from 'bootstrap';
import { Form, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  users: any[] = [];
  students: any[] = [];
  teachers: any[] = [];
  registerRole: string = 'Teacher';
  selectedUserId: number | null = null;
  requireEmailVerification?: boolean;
  registerTeacherData = { fullName: '', email: '', password: '', role: this.registerRole };
  editUserData = { fullName: '', email: '', role: '' };
  email = { emailTo: '', subject: '', body: '', userName:'' }

  constructor(private apiSvc: ApiService, private toastrSvc: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(){
    this.apiSvc.getSystemSetting().subscribe({
      next: (res:any)=>{
        this.requireEmailVerification = res.requireEmailVerification;
      }
    });
    this.apiSvc.getAllUser().subscribe({
      next: (res: any) => {
        this.users = res;
        this.students = res.filter((user:any) => user.role === 'Student');
        this.teachers = res.filter((user:any) => user.role === 'Teacher');
      },
      error: err => {
        this.toastrSvc.error('Error fetching users', err);
      }
    });
  }

  onRegister(form: NgForm) {
    if(this.requireEmailVerification){
      this.apiSvc.AlreadyExists(this.registerTeacherData).subscribe({
        next: (res:any)=>{
          this.email = {
            emailTo: this.registerTeacherData.email,
            subject: '',
            body: '',
            userName: this.registerTeacherData.fullName
          }
          this.apiSvc.SendEmail(this.email).subscribe({
            next: (data:any)=>{
              this.router.navigateByUrl('/verify', {state:{registerObj: this.registerTeacherData, formReg: true, emailObj: this.email}});
              this.toastrSvc.success("Email verification code sent successfully");
            },
            error: (err:any)=>{
              this.toastrSvc.warning(err.error.message, 'Email');
            }
          });
        },
        error: (err:any)=>{
          this.toastrSvc.warning(err.error.message);
        }
      })
    }else{
      this.apiSvc.register(this.registerTeacherData).subscribe({
        next: (res:any) => {
          this.toastrSvc.success('Registered successfully', 'Registered');
          this.router.navigate(['/login']);
        },
        error: (err:any) => {
          this.toastrSvc.error(`${JSON.stringify(err.error.message)}`,'Registration failed');
        }
      });
    }
  }

  viewUser(user: any, element: HTMLElement) {
    const content = `
      <b>Name:</b> ${user.fullName}<br/>
      <b>Email:</b> ${user.email}<br/>
      <b>Role:</b> ${user.role}
    `;

    const popover = Popover.getInstance(element) || new Popover(element, {
      content: content,
      html: true,
      placement: 'left',
      trigger: 'focus'
    });

    popover.setContent({ '.popover-body': content });
    popover.show();
  }

  openModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    }
  }

  editUser(user: any) {
    this.selectedUserId = user.id;
    this.editUserData = {
      fullName: user.fullName,
      email: user.email,
      role: user.role
    };
    this.openModal('editUserModal');
  }

  submitEditForm() {
    if (!this.selectedUserId) return;
    this.closeModal('editUserModal');

    this.apiSvc.updateUser(this.selectedUserId, this.editUserData).subscribe({
      next: () => {
        this.toastrSvc.success('User updated successfully!', 'User');
        this.loadUsers();
      },
      error: err => {
        this.toastrSvc.error(err.error.message,'Update');
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.apiSvc.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          this.students = this.users.filter(user => user.role === 'Student');
          this.teachers = this.users.filter(user => user.role === 'Teacher');
          this.toastrSvc.success('User deleted successfully.');
        },
        error: err => {
          this.toastrSvc.error('Error deleting user', err);
        }
      });
    }
  }
}
