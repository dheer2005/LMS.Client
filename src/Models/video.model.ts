export interface Video {
  id: number;
  title: string;
  filePath: string;
  thumbnailPath: string;
  courseId: number;
  description?: string;
  hover?: boolean;
}