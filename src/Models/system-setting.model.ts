export interface SystemSetting {
  id: number;
  platformName: string;
  logoUrl: string;
  theme: string;

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

  chatEnabled: boolean;
  welcomeMessage: string;

  paidCoursesEnabled: boolean;
  razorpayKey: string;

  enableUserActivityLog: boolean;
  googleAnalyticsCode: string;
  lastBackupDate?: string | null;
}
