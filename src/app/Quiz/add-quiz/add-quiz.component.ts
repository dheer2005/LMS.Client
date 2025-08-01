import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent implements OnInit {

  quizTitle: string = '';
  courseId!: number;

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private toastSvc: ToastrService) {}

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.params['id'];
  }

  submitQuiz() {
    const quiz = {
      title: this.quizTitle,
      courseId: this.courseId,
      questions: []
    };

    this.api.createQuiz(quiz).subscribe((response: any) => {
      const createdQuizId = response.id;  
      this.router.navigate(['/add-question', createdQuizId]); 
    });
  }
}
