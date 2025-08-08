export interface SystemSetting {
  id: number;
  platformName: string;
  logoUrl: string;

  maxVideoUploadSizeMB: number;
  allowedVideoFormats: string;
  quizRetakeLimit: number;

  registrationEnabled: boolean;
  requireEmailVerification: boolean;
  minPasswordLength: number;
  sessionTimeoutMinutes: number;

  paidCoursesEnabled: boolean;

  lastBackupDate?: string | null;
}
