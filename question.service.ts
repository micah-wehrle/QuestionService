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
  
  private questionExists(searchTitle: string): boolean { // Wouldn't normally be needed, but is used by the addQuestionsByCateogry method. 
    for(let question of this.questionList) {
      if(question.title === searchTitle) {
        return true;
      }
    }
    return false;
  }

  public addQuestionsByCategory(category: string): void {
    const questionsToAdd = this.allQuestions[category]; // Get the array of all questions we'd like to add.

    for(let questionToAdd of questionsToAdd) { // Loop through every question we'd like to add.
      if(!this.questionExists(questionToAdd.title)) { // If the question is not already in our stack of questions,
        this.questionList.push(questionToAdd); // then add it.
      }
    }
  }

  public shuffleQuestions(): void {
    let tempQuestions = this.questionList.slice(); // Grab a copy of the current list of questions.
    this.questionList = []; // Erase the original list, so we can randomly add the questions back in.

    while(tempQuestions.length > 0) {
      const randIndex = Math.floor(Math.random() * tempQuestions.length); // Pick a random question from the remaining list of questions
      const questionToPush = tempQuestions.splice(randIndex, 1)[0]; // Remove the question at the given randIndex, and store it in questionToPush. The [0] is because technically .splice() returns an array of the elements removed, and since we're always only removing a single element, we just do [0] to get that one element.
      this.questionList.push(questionToPush); // Add the ranodmly selected question to the final list.
    }

    this.questionIndex = 0; // I'd assume the only time you would want to 
  }

  // public nextQuestion(removeCurrentQuestion: boolean = false): Question {
  public nextQuestion(options: {removeCurrentQuestion?: boolean, shuffleOnLoop?: boolean} = { removeCurrentQuestion: false, shuffleOnLoop: false}): Question { // This is a little experimental for me, not sure how it'll work!
    if(this.questionList.length === 0) {
      throw('Attempting to access an empty question list!'); // I don't know what this will do honestly lol
    }

    if(options.removeCurrentQuestion) {
      this.questionList.splice(this.questionIndex, 1); // Don't need to adjust the index, as the next element in the array will now be at the selected index
    }
    else {
      this.questionIndex++;
    }

    if(this.questionIndex >= this.questionList.length) { // Loop back to beginning if we're at the end
      this.questionIndex = 0;
      if(options.shuffleOnLoop) {
        this.shuffleQuestions();
      }
    }

    return { 
      ...this.questionList[this.questionIndex], 
      isFirstQuestion: this.questionIndex === 0,
      isLastQuestion: this.questionIndex === this.questionList.length-1
    };
  }

  public previousQuestion(removeCurrentQuestion: boolean = false): Question {
    if(this.questionList.length === 0) {
      throw('Attempting to access an empty question list!');// I don't know what this will do honestly lol
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
      isFirstQuestion: this.questionIndex === 0,
      isLastQuestion: this.questionIndex === this.questionList.length-1
    };
  }
  
  public jumpToBeginning(): Question {
    this.questionIndex = -1; // set the index to -1, so that when we call nextQuestion it will give us the quetion at index 0. Prevents the need to write a lot of code twice.
    return this.nextQuestion();
  }

  public questionsLength(): number {
    return this.questionList.length;
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
  
  public forceAddQuestionsByCategory(category: string): void {
    this.questionList.concat(this.allQuestions[category]); 
  }
}
