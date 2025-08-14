import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/Services/api.service';

@Component({
  selector: 'app-quiz-result-detail',
  templateUrl: './quiz-result-detail.component.html',
  styleUrls: ['./quiz-result-detail.component.scss']
})
export class QuizResultDetailComponent implements OnInit {
  quizId!: number;
  results: any[] = [];
  filteredResults: any[] = [];
  passPercentage: number = 50;
  quizTitle: string = '';

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    this.quizId = +this.route.snapshot.params['quizId'];
    this.loadResults();
  }

  loadResults() {
    this.api.getQuizResults(this.quizId).subscribe((res: any) => {
      this.results = res.results;
      this.quizTitle = res.quizTitle;
      this.filterResults();
    });
  }

  filterResults() {
    this.filteredResults = this.results.map(r => ({
      ...r,
      passed: ((r.bestScore/r.totalQuestions)*100) >= this.passPercentage
    }));
  }

}
