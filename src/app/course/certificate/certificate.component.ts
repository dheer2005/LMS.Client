import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { CertificateService } from 'src/app/Services/certificate.service';
import { Certificate } from 'src/Models/certificate.model';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss']
})
export class CertificateComponent implements OnInit {
  userId!: number;
  courseId!: number;
  certificate?: Certificate;
  loading = false;
  error?: string;

  constructor(private route: ActivatedRoute ,private apiSvc: ApiService, private certSvc: CertificateService, private authSvc: AuthService) 
  {
    this.userId = Number(this.authSvc.getId());
  }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.params['courseId'];
    this.certSvc.getGeneratedCertificate(this.userId, this.courseId).subscribe({
      next: (res:any)=>{
        this.certificate = res;
        console.log("generated certificate",this.certificate);
      }
    });
    if(this.certificate == null){
      this.generate();
    }
  }

  generate() {
    this.certSvc.generate(this.userId, this.courseId).subscribe({
      next: (c) => {
         this.certificate = c; 
         this.loading = false;
        },
      error: (e) => {
        this.loading = false;
      }
    });
  }

  download() {
    if (!this.certificate) return;
    this.certSvc.download(this.certificate.certificateId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_${this.certificate!.certificateNumber}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
