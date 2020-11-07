export namespace QuizActions {
  export class LoadQuestions {
    static readonly type = '[Quiz] questions load';

    constructor() {}
  }

  export class StartSession {
    static readonly type = '[Quiz] session start';

    constructor(public questionCount: number) {}
  }

  export class EndSession {
    static readonly type = '[Quiz] session end';

    constructor() {}
  }
  export class QuestionAnswered {
    static readonly type = '[Quiz] question answered';

    constructor(public correct: boolean) {}
  }
}
