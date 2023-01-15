import AttemptResult from "./AttemptResult";
import User from "./User";
import Exercise from "./Exercise";

interface Attempt {
    id: number;
    answer: string;
    completedAt: string;
    userId: number;
    exerciseId: number;
    sandboxId: number;
    attemptResult?: AttemptResult;
    user?: User;
    exercise?: Exercise;
    timeSpentInSeconds: number;
}

export default Attempt;
