import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificateService } from 'src/app/Services/certificate.service';
import { VerifyCertificateResponse } from 'src/Models/verifycertificateresponse.model';

@Component({
  selector: 'app-verify-certificate',
  templateUrl: './verify-certificate.component.html',
  styleUrls: ['./verify-certificate.component.scss']
})
export class VerifyCertificateComponent implements OnInit {
  guid = '';
  result?: VerifyCertificateResponse;
  error?: string;
  loading = false;

  constructor(private route: ActivatedRoute, private certSvc: CertificateService) { }

  ngOnInit(): void {
    this.guid = this.route.snapshot.params['guid'];
  }

  verify(){
    this.loading = true;
    this.error = undefined;
    this.result = undefined;

    this.certSvc.verify(this.guid).subscribe({
      next: (res) => { this.result = res; this.loading = false; },
      error: (e) => { this.error = e?.error ?? 'Not found'; this.loading = false; }
    });
  }

}
