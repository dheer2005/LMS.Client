import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Popover } from 'bootstrap';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  users: any[] = [];
  students: any[] = [];
  teachers: any[] = [];

  selectedUserId: number | null = null;
  editUserData = {
    fullName: '',
    email: '',
    role: ''
  };

  constructor(private apiSvc: ApiService, private toastrSvc: ToastrService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(){
    this.apiSvc.getAllUser().subscribe({
      next: (res: any) => {
        this.users = res;
        this.students = res.filter((user:any) => user.role === 'Student');
        this.teachers = res.filter((user:any) => user.role === 'Teacher');
        console.log("Students:", this.students);
        console.log("Teachers:", this.teachers);
      },
      error: err => {
        this.toastrSvc.error('Error fetching users', err);
      }
    });
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

    this.apiSvc.updateUser(this.selectedUserId, this.editUserData).subscribe({
      next: () => {
        this.toastrSvc.success('User updated successfully!', 'User');
        this.loadUsers();

        this.closeModal('editUserModal');
      },
      error: err => {
        // this.toastrSvc.error('Error updating user', err);
        this.toastrSvc.error('Failed to update user.');
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
