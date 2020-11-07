import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MultipleChoiceQuestion, QuizAnswer } from '../../state/quiz.model';
import { QuestionTypeComponent } from '../question/question.component';

@Component({
  selector: 'solid-quiz-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss'],
})
export class MultipleChoiceQuestionComponent implements QuestionTypeComponent {
  @Input() question!: MultipleChoiceQuestion;
  @Input() showAnswers = false;
  @Output() answerChanged = new EventEmitter<boolean>();
  public selectedAnswers: number[] = [];

  public onSelectChange(e: MatCheckboxChange, answer: QuizAnswer) {
    if (e.checked) {
      this.selectedAnswers.push(answer.id);
    } else {
      this.selectedAnswers = this.selectedAnswers.filter(
        (id) => id !== answer.id
      );
    }
  }

  public trackByFn(index: number, item: QuizAnswer) {
    return item.id;
  }

  public isAnswerCorrect(answer: QuizAnswer) {
    if (!this.showAnswers) {
      return false;
    }
    return answer.correct;
  }

  public isAnswerIncorrect(answer: QuizAnswer) {
    if (!this.showAnswers) {
      return false;
    }
    return !answer.correct;
  }

  validateAnswers(): boolean {
    let correct = true;
    let correctAnswers = 0;
    this.question.answers.forEach((answer) => {
      if (answer.correct) {
        correctAnswers++;
        if (!this.selectedAnswers.includes(answer.id)) {
          correct = false;
        }
      }
    });
    if (this.selectedAnswers.length !== correctAnswers) {
      correct = false;
    }
    return correct;
  }
}
