import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SystemSetting } from 'src/Models/system-setting.model';

@Injectable({
  providedIn: 'root'
})
export class SystemSettingService {
  // ApiUrl: string = 'https://localhost:7071/api/Admin';
  ApiUrl: string = 'https://SmartLms.bsite.net/api/Admin';

  constructor(private http: HttpClient) { }

  private settingSubject = new BehaviorSubject<SystemSetting | null>(null);
  setting$ = this.settingSubject.asObservable();
  private logoSubject = new BehaviorSubject<string>('');
  logo$ = this.logoSubject.asObservable();

  setLogo(logoUrl: string){
    this.logoSubject.next(logoUrl);
  }

  get currentLogo(): string {
    return this.logoSubject.getValue();
  }

  loadSettings(): Observable<SystemSetting> {
    return this.http.get<SystemSetting>(`${this.ApiUrl}/get-systemSetting`).pipe(
      tap(setting => {
        if(setting.logoUrl){
          this.setLogo(setting.logoUrl);
        }
        this.settingSubject.next(setting)
      })
    );
  }

  getSettings(): Observable<SystemSetting> {
    // if already loaded return BehaviorSubject as observable, otherwise load
    if (!this.settingSubject.value) {
      return this.loadSettings();
    }
    return this.setting$ as Observable<SystemSetting>;
  }

  updateSettings(setting: SystemSetting): Observable<SystemSetting> {
    return this.http.put<SystemSetting>(`${this.ApiUrl}/update-systemSetting/${setting.id}`, setting).pipe(
      tap(updated => this.settingSubject.next(updated))
    );
  }

  uploadLogo(file: File): Observable<{ url: string }> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post<{ url: string }>(`${this.ApiUrl}/upload-logo`, form);
  }


}
