import { Injectable } from "@angular/core";

export interface Question {
  title: string,
  answer: string,
  isFirstQuestion?: boolean,
  isLastQuestion?: boolean
}

@Injectable({providedIn: 'root'})
export class QuestionService {

  private allQuestions: {[key: string]: Question[]} = {
    'angular' : [
      {
        title: 'What is angular?',
        answer: 'Who knows lol'
      },
      {
        title: 'Who is angular?',
        answer: 'Kerry is'
      },
    ],
    'javascript' : [
      {
        title: 'What is a for loop?',
        answer: 'i = 0; i < 10; i++'
      },
      {
        title: 'How many booleans are there?',
        answer: 'Yes.'
      },
    ],
  };

  private questionList: Question[] = [];

  private questionIndex: number = 0;

  public clearQuestions(): void {
    this.questionList = [];
  }
  
    private questionExists(searchTitle: string): boolean {
      for(let question of this.questionList) {
        if(question.title === searchTitle) {
          return true;
        }
      }
      return false;
    }

  public addQuestionsByCategory(category: string): void {
    const questionsToAdd = this.allQuestions[category];

    for(let questionToAdd of questionsToAdd) {
      if(!this.questionExists(questionToAdd.title)) {
        this.questionList.push(questionToAdd);
      }
    }
  }

  public forceAddQuestionsByCategory(category: string): void {
    this.questionList.concat(this.allQuestions[category]);
  }

  public shuffleQuestions(): void {
    let tempQuestions = this.questionList.slice();
    this.questionList = [];

    while(tempQuestions.length > 0) {
      const randIndex = Math.floor(Math.random() * tempQuestions.length);
      const questionToPush = tempQuestions.splice(randIndex, 1)[0];
      this.questionList.push(questionToPush);
    }

    this.questionIndex = 0;
  }

  public nextQuestion(removeCurrentQuestion: boolean = false): Question {

    if(this.questionList.length === 0) {
      throw('error');
    }

    if(removeCurrentQuestion) {
      this.questionList.splice(this.questionIndex, 1);
    }
    else {
      this.questionIndex++;
    }

    if(this.questionIndex >= this.questionList.length) {
      this.questionIndex = 0;
    }

    return { 
      ...this.questionList[this.questionIndex], 
      isLastQuestion: this.questionIndex === this.questionList.length-1 ? true : false 
    };
  }

  public previousQuestion(removeCurrentQuestion: boolean = false): Question {
    if(this.questionList.length === 0) {
      throw('error');
    }
    
    if(removeCurrentQuestion) {
      this.questionList.splice(this.questionIndex, 1);
    }
    
    this.questionIndex--;
    if(this.questionIndex < 0) {
      this.questionIndex = this.questionList.length-1;
    }

    return { 
      ...this.questionList[this.questionIndex], 
      isFirstQuestion: this.questionIndex === 0
    };
  }





  // I made all these methods, but I don't know if they would really be needed!

  public getQuestionList(): Question[] {
    return this.questionList.slice();
  }

  public removeQuestionAt(index: number): void {
    this.questionList.splice(index, 1);
  }

  public removeQuestionByTitle(searchTitle: string): void {
    for(let i = 0; i < this.questionList.length; i++) { 
      if(this.questionList[i].title === searchTitle) { 
        this.questionList.splice(i, 1); 
        return; 
      }
    }
  }

  public getQuestionByTitle(searchTitle: string): Question {
    for(let category in this.allQuestions) {
      for(let question of this.allQuestions[category]) {
        if(question.title === searchTitle) {
          return question;
        }
      }
    }

    return {title:'', answer: ''};
  }


}
