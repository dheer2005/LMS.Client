import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { ElementRef, ViewChild } from '@angular/core';
import { Popover } from 'bootstrap';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef;

  @ViewChild('signatureCanvas') signatureCanvasRef?: ElementRef<HTMLCanvasElement>;
  private sigCtx?: CanvasRenderingContext2D | null;
  isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  signaturePadOpenFor: 'register' | 'edit' | null = null;

  selectedThumbnailFile: File | null = null;
  signaturePreviewUrl: SafeUrl | null = null; 
  strokes: { x: number, y: number }[][] = [];
  currentStroke: { x: number, y: number }[] = [];

  users: any[] = [];
  students: any[] = [];
  teachers: any[] = [];
  registerRole: string = 'Teacher';
  selectedUserId: number | null = null;
  requireEmailVerification?: boolean;
  registerTeacherData = { fullName: '', email: '', password: '', role: this.registerRole, signature: '' };
  editUserData = { fullName: '', email: '', role: '', signature: '' };
  email = { emailTo: '', subject: '', body: '', userName:'' }
  minPasswordLength:any;

  constructor(private apiSvc: ApiService, private toastrSvc: ToastrService, private router: Router, private sanitizer: DomSanitizer) {
    this.apiSvc.getPasswordLength().subscribe({
      next:(res:any)=>{
        this.minPasswordLength = res;
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  openSignaturePad(forForm: 'register' | 'edit'){
    this.signaturePadOpenFor = forForm;
    this.closeModal(forForm === 'register' ? 'registerModal' : 'editUserModal');

    this.openModal('signaturePadModal');
    setTimeout(() => this.initSignatureCanvas(), 0);
  }

  private initSignatureCanvas() 
  {
    const canvas = this.signatureCanvasRef?.nativeElement;
    if (!canvas) return;

    const cssWidth = canvas.clientWidth || 500;
    const cssHeight = 200;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    this.sigCtx = canvas.getContext('2d');
    if (!this.sigCtx) return;

    this.sigCtx.fillStyle = '#ffffff';
    this.sigCtx.fillRect(0, 0, cssWidth, cssHeight);

    this.sigCtx.strokeStyle = '#000000';
    this.sigCtx.lineWidth = 2;
    this.sigCtx.lineCap = 'round';
    this.sigCtx.lineJoin = 'round';
  }


  startDraw(ev: PointerEvent) {
    if (!this.sigCtx || !this.signatureCanvasRef) return;
    const { x, y } = this.canvasPoint(ev);
    this.isDrawing = true;
    this.lastX = x; this.lastY = y;
    this.sigCtx.beginPath();
    this.sigCtx.moveTo(x, y);
  }

  draw(ev: PointerEvent) {
    if (!this.sigCtx || !this.isDrawing) return;
    const { x, y } = this.canvasPoint(ev);
    this.sigCtx.beginPath();   
    this.sigCtx.moveTo(this.lastX, this.lastY);

    this.sigCtx.lineTo(x,y);
    this.sigCtx.stroke();
    this.lastX = x; this.lastY = y;
  }

  endDraw() {
    this.isDrawing = false;
  }

  clearSignature() {
    const canvas = this.signatureCanvasRef?.nativeElement;
    if (!canvas || !this.sigCtx) return;
    this.sigCtx.clearRect(0, 0, canvas.width, canvas.height);
    this.sigCtx.fillStyle = '#ffffff';
    this.sigCtx.fillRect(0, 0, canvas.width, canvas.height);
  }

  clearUploadedSignature() {
    this.selectedThumbnailFile = null;
    this.signaturePreviewUrl = null;
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  useSignature() {
    const canvas = this.signatureCanvasRef?.nativeElement;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'signature.png', { type: 'image/png' });

      this.selectedThumbnailFile = file;

      const oldUrl = this.signaturePreviewUrl as string;

      this.signaturePreviewUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));

      if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
      }

      this.closeModal('signaturePadModal');
      if (this.signaturePadOpenFor === 'register') {
        this.openModal('registerModal');
      } else if (this.signaturePadOpenFor === 'edit') {
        this.openModal('editUserModal');
      }
      this.toastrSvc.success('Signature captured', 'Signature');
    }, 'image/png');
  }

  closeCanvasModalonCross(){
    this.closeModal('signaturePadModal');
    if (this.signaturePadOpenFor === 'register') {
      this.openModal('registerModal');
    } else if (this.signaturePadOpenFor === 'edit') {
      this.openModal('editUserModal');
    }
  }

  private canvasPoint(ev: PointerEvent) {
    const canvas = this.signatureCanvasRef!.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const x = (ev.clientX - rect.left) * dpr;
    const y = (ev.clientY - rect.top) * dpr;

    return { x, y };
  }

  cancelTouchDefault(ev: Event) {
    ev.preventDefault();
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
        console.log(this.teachers);
      },
      error: err => {
        console.log(err);
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
          const formData = new FormData();
          formData.append('fullname', this.registerTeacherData.fullName);
          formData.append('email', this.registerTeacherData.email);
          formData.append('password', this.registerTeacherData.password);
          formData.append('role', this.registerTeacherData.role);
          if (this.selectedThumbnailFile) {
            formData.append('signature', this.selectedThumbnailFile);
          }
          this.apiSvc.SendEmail(this.email).subscribe({
            next: (data:any)=>{
              this.router.navigateByUrl('/verify', {state:{registerObj: formData, formReg: true, emailObj: this.email}});
              if(this.fileInputRef){
                this.fileInputRef.nativeElement.value = '';
              }
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
      const formData = new FormData();
      formData.append('fullname', this.registerTeacherData.fullName);
      formData.append('email', this.registerTeacherData.email);
      formData.append('password', this.registerTeacherData.password);
      formData.append('role', this.registerTeacherData.role);
      if (this.selectedThumbnailFile) {
        formData.append('signature', this.selectedThumbnailFile);
      }
      this.apiSvc.register(formData).subscribe({
        next: (res:any) => {
          this.toastrSvc.success('Registered successfully', 'Registered');
          this.loadUsers();
          this.selectedThumbnailFile = null;
          if(this.fileInputRef){
            this.fileInputRef.nativeElement.value = '';
          }
          this.clearUploadedSignature();
        },
        error: (err:any) => {
          this.clearUploadedSignature();
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
      signature: user.signature,
      role: user.role
    };
    this.openModal('editUserModal');
  }

  submitEditForm() {
    if (!this.selectedUserId) return;
    this.closeModal('editUserModal');
    const editFormData = new FormData();
    editFormData.append('fullName', this.editUserData.fullName);
    editFormData.append('email', this.editUserData.email);
    editFormData.append('role', this.editUserData.role);
    if (this.selectedThumbnailFile) {
      editFormData.append('signature', this.selectedThumbnailFile);
    }
    this.apiSvc.updateUser(this.selectedUserId, editFormData).subscribe({
      next: () => {
        this.toastrSvc.success('User updated successfully!', 'User');
        this.selectedThumbnailFile = null;
        if(this.fileInputRef){
          this.fileInputRef.nativeElement.value = '';
        }
        this.clearUploadedSignature();
        this.loadUsers();
      },
      error: err => {
        this.toastrSvc.error(err.error.message,'Update');
        this.clearUploadedSignature();
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
          this.toastrSvc.error('Error deleting user', err.error.message);
        }
      });
    }
  }

  onSignatureSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0){
      this.selectedThumbnailFile = input.files[0];
    }
  }


  cancelModal(){
    this.registerTeacherData = { fullName: '', email: '', password: '', role: this.registerRole, signature: '' };
    this.clearUploadedSignature();
  }

}
