import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { QuizSession } from '../../state/quiz.model';
import { QuizActions } from '../../state/quiz.actions';
import { QuizFeedback } from './end-feedback';

@Component({
  selector: 'solid-quiz-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss'],
})
export class EndComponent {
  QuizSession: QuizSession | null = null;
  QuestionCount = 10;
  FeedbackText = '';
  correctQuestions = 0;
  correctPercentage = 0;

  constructor(private _store: Store) {
    this._store
      .select((s) => s.quiz.session)
      .subscribe((session: QuizSession | null) => {
        if (session) {
          this.QuizSession = session;
          this.QuestionCount = session.questions.length;
          this.correctQuestions = session.questions
            .map((q) => q.answered)
            .reduce((curr, val) => (val === 1 ? curr + 1 : curr), 0 as number);
          this.correctPercentage = this.correctQuestions / this.QuestionCount;
          let feedbacks: string[] = [];
          if (this.correctPercentage < 0.25) {
            feedbacks = QuizFeedback.lt25;
          } else if (this.correctPercentage < 0.5) {
            feedbacks = QuizFeedback.lt50;
          } else if (this.correctPercentage < 0.75) {
            feedbacks = QuizFeedback.lt75;
          } else if (this.correctPercentage === 1) {
            feedbacks = QuizFeedback.e100;
          } else {
            feedbacks = QuizFeedback.ge75;
          }
          this.FeedbackText =
            feedbacks[Math.floor(Math.random() * feedbacks.length)];
          this.FeedbackText = this.FeedbackText.replace(
            '{{correctPercentage}}',
            Math.round(100 * this.correctPercentage).toString(10)
          );
          this.FeedbackText = this.FeedbackText.replace(
            '{{Count}}',
            this.QuestionCount.toString(10)
          );
        }
      });
  }

  onStartClick() {
    this._store.dispatch(new QuizActions.StartSession(this.QuestionCount));
  }
}
