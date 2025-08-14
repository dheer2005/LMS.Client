import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-quiz-result-list',
  templateUrl: './quiz-result-list.component.html',
  styleUrls: ['./quiz-result-list.component.scss']
})
export class QuizResultListComponent implements OnInit {
  courseId!: number;
  quizzes: any[] = [];

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.courseId = +this.route.snapshot.params['courseId'];
    this.api.getQuizzesByCourse(this.courseId).subscribe((res: any) => {
      this.quizzes = res;
    });
  }

  viewQuizDetail(quizId: number) {
    this.router.navigate(['/quiz-result-detail', quizId]);
  }

}
