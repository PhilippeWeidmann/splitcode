import AttemptResult from "./AttemptResult";
import User from "./User";
import Sandbox from "./Sandbox";

interface GroupAttempt {
    id: number;
    answer: string;
    completedAt: string;
    user: User;
    remoteUser: User;
    firstUser?: User;
    firstUserId?: number;
    secondUserId?: number;
    secondUser?: User;
    exerciseId: number;
    userSandboxId: number;
    remoteSandboxId: number;
    sharedSandboxId: number;
    sharedSandbox?: Sandbox;
    attemptResult?: AttemptResult;
    timeSpentInSecondsFirstUser: number;
    timeSpentInSecondsSecondUser: number;
}

export default GroupAttempt;
