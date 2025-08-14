import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizResultDetailComponent } from './quiz-result-detail.component';

describe('QuizResultDetailComponent', () => {
  let component: QuizResultDetailComponent;
  let fixture: ComponentFixture<QuizResultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizResultDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizResultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
