export interface SystemSetting {
  id: number;
  platformName: string;
  logoUrl: string;

  maxVideoUploadSizeMB: number;
  allowedVideoFormats: string;
  requireEnrollmentApproval: boolean;

  defaultQuizTimeMinutes: number;
  quizRetakeLimit: number;
  passPercentage: number;

  registrationEnabled: boolean;
  requireEmailVerification: boolean;
  minPasswordLength: number;
  sessionTimeoutMinutes: number;

  paidCoursesEnabled: boolean;

  lastBackupDate?: string | null;
}
