import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  DragAndDropQuestion,
  QuizQuestionInSession,
  QuizQuestions,
  QuizQuestionType,
  QuizSession,
} from './quiz.model';
import { QuizActions } from './quiz.actions';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SOLID_CORE_CONFIG, SolidCoreConfig } from '@zentrumnawi/solid-core';
import { tap } from 'rxjs/operators';

export interface QuizStateModel {
  questions: QuizQuestions[];
  session: QuizSession | null;
}

// TODO: Remove testing data for drag and drop questions
const exampleDragAndDropQuestion: DragAndDropQuestion = {
  answers: [
    { text: '1', position: 1 },
    { text: '2', position: 2 },
    { text: '3', position: 3 },
    { text: '4', position: 4 },
    { text: '5', position: 5 },
  ],
  difficulty: 1,
  feedback_correct: 'You\'re a great mathematician',
  feedback_incorrect: 'You should work on your math skills',
  id: 0,
  tags: [],
  text: 'Ordnen Sie die Filmnamen nach Alphabet',
  type: QuizQuestionType.DragAndDrop,
};

@State<QuizStateModel>({
  name: 'quiz',
  defaults: {
    questions: [],
    session: null,
  },
})
@Injectable()
export class QuizState {
  @Selector()
  static getSession(state: QuizStateModel): QuizSession | null {
    return state.session;
  }
  constructor(
    @Inject(SOLID_CORE_CONFIG) private _config: SolidCoreConfig,
    private _http: HttpClient
  ) {}

  @Action(QuizActions.LoadQuestions)
  public set(ctx: StateContext<QuizStateModel>, {}: QuizActions.LoadQuestions) {
    return this._http
      .get<QuizQuestions[]>(`${this._config.apiUrl}/quizquestions`)
      .pipe(
        tap((res) => {
          ctx.patchState({
            // questions: res,
            // TODO: Remove testing data for drag and drop questions
            questions: res.reduce(
              (arr, v) => [...arr, exampleDragAndDropQuestion, v],
              [] as QuizQuestions[]
            ),
          });
        })
      );
  }

  @Action(QuizActions.StartSession)
  public startSession(
    { patchState, getState }: StateContext<QuizStateModel>,
    { questionCount }: QuizActions.StartSession
  ) {
    const questions = getState().questions;
    const sessionQuestions: QuizQuestionInSession[] = [];
    questionCount =
      questionCount > questions.length ? questions.length : questionCount;
    for (let i = 0; i < questionCount; ) {
      const rnd = Math.floor(Math.random() * questions.length);
      if (sessionQuestions.find((q) => q.id === questions[rnd].id)) {
        continue;
      }
      sessionQuestions.push({ answered: 0, ...questions[rnd] });
      i++;
    }
    patchState({
      session: {
        progress: 0,
        currentQuestion: 0,
        questions: sessionQuestions,
      },
    });
  }

  @Action(QuizActions.EndSession)
  public endSession(
    { patchState }: StateContext<QuizStateModel>,
    {}: QuizActions.EndSession
  ) {
    patchState({
      session: null,
    });
  }

  @Action(QuizActions.QuestionAnswered)
  public questionAnswered(
    { patchState, getState }: StateContext<QuizStateModel>,
    { correct }: QuizActions.QuestionAnswered
  ) {
    const session = { ...(getState().session as QuizSession) };
    const answeredQuestion = {
      ...session.questions[session.currentQuestion],
      answered: (correct ? 1 : -1) as 1 | -1,
    };
    patchState({
      session: {
        currentQuestion: session.currentQuestion + 1,
        progress:
          (100.0 / session.questions.length) * (session.currentQuestion + 1),
        questions: session.questions.map((q) =>
          q.id === answeredQuestion.id ? answeredQuestion : q
        ),
      },
    });
  }
}
