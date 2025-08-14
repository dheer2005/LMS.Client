import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizResultListComponent } from './quiz-result-list.component';

describe('QuizResultListComponent', () => {
  let component: QuizResultListComponent;
  let fixture: ComponentFixture<QuizResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizResultListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
