import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/Services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
})
export class AddQuestionComponent implements OnInit {
  quizId!: number;
  question = {
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: '',
    quizId: 0
  };

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private apiSvc: ApiService,
    private toastSvc: ToastrService
  ) {}

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.paramMap.get('quizId')!;
    this.question.quizId = this.quizId;
  }

  submit(): void {
    this.apiSvc.addQuestionToQuiz(this.question).subscribe({
      next: () => {
        this.toastSvc.success('Question added successfully!', 'Question');
        this.router.navigate(['/quiz-detail', this.quizId]);
      },
      error: (err) => {
        this.toastSvc.error('Failed to add question.');
      }
    });
  }
}
