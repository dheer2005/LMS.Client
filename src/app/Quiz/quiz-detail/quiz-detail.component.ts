import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-quiz-detail',
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.scss']
})
export class QuizDetailComponent implements OnInit {
  quizId!: number;
  quiz: any;
  answers: { [questionId: number]: string } = {};
  scoreResult: any;
  userRole?: string

  constructor(private route: ActivatedRoute, private api: ApiService, private authSvc: AuthService, private router: Router, private toastrSvc: ToastrService) {
    this.userRole = this.authSvc.getRole();
  }

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.params['id'];
    this.api.getQuizDetails(this.quizId).subscribe((res: any) => {
      this.quiz = res;
      if (!res || !res.questions || !Array.isArray(res.questions)) {
        this.toastrSvc.error("Invalid quiz format. No questions found.");
      }
    });
  }

  submitQuiz(): void {
    if (!this.quiz || !this.quiz.questions || !Array.isArray(this.quiz.questions)) {
      this.toastrSvc.error('Quiz data is not loaded properly.', 'Error');
      return;
    }

    const totalQuestions = this.quiz.questions.length;
    const answeredQuestion = Object.keys(this.answers).length;

    if (answeredQuestion < totalQuestions) {
      this.toastrSvc.info(`Please attempt all ${totalQuestions} questions before submitting.`, 'Info');
      return;
    }

    const payload = {
      quizId: this.quizId,
      answers: Object.entries(this.answers).map(([questionId, selectedOption]) => ({
        questionId: +questionId,
        selectedOption
      }))
    };

    this.api.submitQuizAnswers(payload).subscribe({
      next: (result: any) => {
        this.scoreResult = result;

        for (let q of this.quiz.questions) {
          const answered = payload.answers.find(a => a.questionId === q.questionId);
          q.selectedOption = answered?.selectedOption;
          q.isCorrect = q.selectedOption === q.correctOption;
        }
        this.toastrSvc.success('Quiz submitted successfully!', 'Success');
      },
      error: (err) => {
        this.toastrSvc.error("Quiz submission failed. Try again later.", 'Error');
      }
    });
  }

  addQuestionToQuiz(){
    this.router.navigate(['/add-question', this.quizId]);
  }
}
