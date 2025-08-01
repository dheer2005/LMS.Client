export interface PaymentDTO {
  studentId: number;
  courseId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: Date | string;
  razorpayPaymentId: string
  razorpayOrderId: string
  razorpaySignature: string
}