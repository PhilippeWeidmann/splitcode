class QuestionAttempt {
    questionId: number;
    attemptId: number;
    userId: number;
    answer: number;

    constructor(questionId: number, attemptId: number, userId: number, answer: number) {
        this.questionId = questionId;
        this.userId = userId;
        this.attemptId = attemptId;
        this.answer = answer;
    }
}

export default QuestionAttempt;
