import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'console';
import { PaymentDTO } from 'DTOs/paymentDto.dto';
import { RazorpayResponse } from 'DTOs/razorpayresponse.dto';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';
import { Course } from 'src/Models/course.model';

@Component({
  selector: 'app-view-courses',
  templateUrl: './view-courses.component.html',
  styleUrls: ['./view-courses.component.scss']
})
export class ViewCoursesComponent implements OnInit {

  courses: Course[] = [];
  studentId?: number;
  courseId?: number;
  coursePrice?: number;
  
    constructor(private apiSvc: ApiService, private authSvc: AuthService, private toastSvc: ToastrService, private router: Router) {
      this.studentId = Number(this.authSvc.getId());
    }
  
    ngOnInit() {
      this.apiSvc.getAllCourses(this.studentId!).subscribe((res:any) => {
        this.courses = res.sort((a:any,b:any)=>{
          return (b.isEnrolled ? 1 : 0) - (a.isEnrolled ? 1 : 0);
        });
      });
    }

    Pay(course:any){
      this.courseId = course.id;
      this.coursePrice = course.price;
      this.apiSvc.createOrder(this.coursePrice!).subscribe({
        next: (order:any)=>{
        const options = {
        key: "rzp_test_X3Lg7L57herVXe",
        amount: order.amount,
        currency: order.currency,
        name: "LMS_client",
        order_id: order.orderId,
        handler: (response: RazorpayResponse) => this.handlePaymentSuccess(response),
        prefill: {
          name: "LMS",
          email: "lms@gmail.com",
          contact: "9999999999"
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: () => {
            this.toastSvc.error('Payment cancelled by user.', 'Payment');
          }
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      },
    error: (err:any)=>{
      this.toastSvc.warning(err.error.message);
    }}
    );
    }

    private handlePaymentSuccess(response: RazorpayResponse) {
    const payload = {
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature
    };

    this.apiSvc.verifyPayment(payload).subscribe({
      next: () => this.EnrollCourse(response),
      error: err => {
        this.toastSvc.error('Payment verification failed', 'Payment');
      }
    });
  }

  private EnrollCourse(response: RazorpayResponse) {
    const payload = {
      studentId: this.studentId,
      courseId: this.courseId
    };

    this.apiSvc.enrollCourse(payload).subscribe({
      next: (enrollRes:any) => {
        const paymentPayload: PaymentDTO = {
          studentId: this.studentId!,
          courseId: this.courseId!,
          amount: this.coursePrice!,
          paymentMethod: 'Razorpay',
          paymentStatus: 'Success',
          paymentDate: new Date(),
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature
        };
        this.apiSvc.savePayment(paymentPayload).subscribe({
          next: () => {
            this.toastSvc.success('Course Enrolled', 'Enrollment');
            this.router.navigate(['/view-courses']).then(()=>location.reload());
          },
          error: (err) => {
            this.toastSvc.error('Payment save failed.', 'Payment');
          }
        });
      },
      error: err => {
        this.toastSvc.error(`Course enrollment failed, Please contact support`, `${err.error}`);
      }
    });
  }

}
