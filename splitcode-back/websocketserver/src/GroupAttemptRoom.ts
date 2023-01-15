class GroupAttemptRoom {
    groupAttemptId: number;
    firstUserId: number;
    secondUserId?: number;
    firstUserSandboxId: number;
    secondUserSandboxId?: number;
    sharedSandboxId: number;

    constructor(groupAttemptId: number, firstUserId: number, secondUserId: number | undefined, firstUserSandboxId: number, secondUserSandboxId: number | undefined, sharedSandboxId: number) {
        this.groupAttemptId = groupAttemptId;
        this.firstUserId = firstUserId;
        this.secondUserId = secondUserId;
        this.firstUserSandboxId = firstUserSandboxId;
        this.secondUserSandboxId = secondUserSandboxId;
        this.sharedSandboxId = sharedSandboxId;
    }
}

export default GroupAttemptRoom;
