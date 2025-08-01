export interface Course {
  id?: number;
  title: string;
  description: string;
  teacherId?: number;
  price?: number;
  isEnrolled?: boolean;
  thumbnailPath: string;
}