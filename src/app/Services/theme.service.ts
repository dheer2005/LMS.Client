import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'app_theme';
  private themeSubject = new BehaviorSubject<'light' | 'dark'>(this.getStoredTheme());
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.setTheme(this.themeSubject.value);
  }

  private getStoredTheme(): 'light' | 'dark' {
    const saved = localStorage.getItem(this.themeKey);
    return saved === 'dark' ? 'dark' : 'light';
  }

  setTheme(theme: 'light' | 'dark') {
    const body = document.body;
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
    }

    localStorage.setItem(this.themeKey, theme);
    this.themeSubject.next(theme);
  }

  toggleTheme() {
    const current = this.themeSubject.value;
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  getTheme(): 'light' | 'dark' {
    return this.themeSubject.value;
  }
}
