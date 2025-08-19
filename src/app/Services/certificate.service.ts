import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificate } from 'src/Models/certificate.model';
import { VerifyCertificateResponse } from 'src/Models/verifycertificateresponse.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  ApiUrl: string = 'https://localhost:7071/api/Certificate/';
  // ApiUrl: string = 'https://SmartLms.bsite.net/api/';

  constructor(private http: HttpClient) { }

  getGeneratedCertificate(userId: number, courseId: number){
    return this.http.get(`${this.ApiUrl}get-certificate/${userId}/${courseId}`);
  }

  generate(userId: number, courseId: number): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.ApiUrl}generate/${userId}/${courseId}`, {});
  }

  verify(guid: string): Observable<VerifyCertificateResponse> {
    return this.http.get<VerifyCertificateResponse>(`${this.ApiUrl}verify/${guid}`);
  }

  download(certificateId: number): Observable<Blob> {
    return this.http.get(`${this.ApiUrl}download/${certificateId}`, { responseType: 'blob' });
  }
}
