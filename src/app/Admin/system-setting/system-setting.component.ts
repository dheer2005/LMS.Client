import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SystemSettingService } from 'src/app/Services/system-setting.service';
import { SystemSetting } from 'src/Models/system-setting.model';

@Component({
  selector: 'app-system-setting',
  templateUrl: './system-setting.component.html',
  styleUrls: ['./system-setting.component.scss']
})
export class SystemSettingComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef;
  form!: FormGroup;
  setting!: SystemSetting | null;
  logoFile?: File;
  loading = false;

  constructor(private fb: FormBuilder, private settingSvc: SystemSettingService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      platformName: ['', Validators.required],
      maxVideoUploadSizeMB: [500, [Validators.required, Validators.min(1)]],
      allowedVideoFormats: ['mp4,webm,mov'],
      quizRetakeLimit: [2],
      registrationEnabled: [true],
      requireEmailVerification: [false],
      minPasswordLength: [6],
      sessionTimeoutMinutes: [30],
      paidCoursesEnabled: [false]
    });

    this.load();
    this.settingSvc.setting$.subscribe(s => {
      if (s) {
        this.setting = s;
        // console.log("settings response:", this.setting);
        this.form.patchValue({
          platformName: s.platformName,
          maxVideoUploadSizeMB: s.maxVideoUploadSizeMB,
          allowedVideoFormats: s.allowedVideoFormats,
          quizRetakeLimit: s.quizRetakeLimit,
          registrationEnabled: s.registrationEnabled,
          requireEmailVerification: s.requireEmailVerification,
          minPasswordLength: s.minPasswordLength,
          sessionTimeoutMinutes: s.sessionTimeoutMinutes,
          paidCoursesEnabled: s.paidCoursesEnabled,
        });
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) this.logoFile = file;
  }

  uploadLogoAndSave(): void {
    if (!this.logoFile || !this.setting) return;

    this.loading = true;
    this.settingSvc.uploadLogo(this.logoFile).subscribe({
      next: (res) => {
        const updated: SystemSetting = { ...this.setting!, ...this.form.value, logoUrl: res.url };
        this.save(updated);
        this.fileInputRef.nativeElement.value = '';
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Logo upload failed');
        console.error(err);
      }
    });
  }

  save(settingFromForm?: SystemSetting) {
    if (!this.setting && !settingFromForm) {
      this.toastr.error('No setting to save');
      return;
    }

    const payload: SystemSetting = settingFromForm ?? { ...(this.setting as SystemSetting), ...this.form.value };

    this.loading = true;
    this.settingSvc.updateSettings(payload).subscribe({
      next: (res:any) => {
        this.loading = false;
        if(res.logoUrl){
          this.settingSvc.setLogo(res.logoUrl);
        }
        this.toastr.success('Settings saved');
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Failed to save settings');
        console.error(err);
      }
    });
  }

  load() {
    this.settingSvc.loadSettings().subscribe({
      next: (s) => {
        this.setting = s;
      },
      error: (err) => {
        this.loading = true;
        console.error('Failed to load settings', err);
      }
    });
  }

}
