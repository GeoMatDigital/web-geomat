import { Component, Input, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { DragAndDropQuestion, QuizAnswer } from '../../state/quiz.model';
import { QuestionTypeComponent } from '../question/question.component';


class Status {
  constructor(public text: string, public status: string) {
  }
}

@Component({
  selector: 'solid-quiz-drag-and-drop-question',
  templateUrl: './drag-and-drop-question.component.html',
  styleUrls: ['./drag-and-drop-question.component.scss'],
})
export class DragAndDropQuestionComponent implements QuestionTypeComponent, OnInit {
  @Input() public question!: DragAndDropQuestion;
  @Input() public showAnswers = false;
  isShow: Boolean = true;

  status: Status = new Status('', '');
  result: Status[] = [];
  movies = [
    ' I - The Phantom Menace',
    ' II - Attack of the Clones',
    'III - Revenge of the Sith',
    'IV - A New Hope',
    'V - The Empire Strikes Back',
  ];

  duplicate = [
    ' I - The Phantom Menace',
    ' II - Attack of the Clones',
    'III - Revenge of the Sith',
    'IV - A New Hope',
    'V - The Empire Strikes Back',
  ];

  ngOnInit(): void {
    console.log(this.status);
    this.movies = this.shuffle(this.movies);
  }

  public trackByFn(item: QuizAnswer) {
    return item.id;
  }

  shuffle(array: any[]) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }

  objectsAreSame(x: any[], y: any[]) {
    for (const propertyName in x) {
       if (x[propertyName] !== y[propertyName]) {
          const status = new Status('X', 'red');
          this.status = status;
          this.result.push(this.status);
       } else {
        const status = new Status('✓', 'green');
        this.status = status;
        this.result.push(this.status);
       }
    }

    let objectsAreSame = true;
    for (const propertyName in x) {
       if (x[propertyName] !== y[propertyName]) {
          objectsAreSame = false;
          break;
       }
    }
    this.isShow = !this.isShow;
    return objectsAreSame;
 }

  validateAnswers(): boolean {
    // TODO: Implement me
    return this.objectsAreSame(this.duplicate, this.movies);
  }
}
