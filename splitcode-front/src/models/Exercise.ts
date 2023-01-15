import Attempt from "./Attempt";
import Course from "./Course";
import GroupAttempt from "./GroupAttempt";

class Exercise {
    id: number
    title: string
    description: string
    result: string
    startTime: string
    soloEndTime: string
    endTime: string
    courseId: number
    notation: number
    attempt?: Attempt
    groupAttempt?: GroupAttempt
    groupAttempts?: GroupAttempt[]
    attempts?: Attempt[]
    course?: Course
    startingCode?: string
    answeredQuestions: boolean;

    constructor(title: string, description: string, result: string, startTime: string, soloEndTime: string, endTime: string, courseId: number, notation: number, id?: number, startingCode?: string) {
        if (id) {
            this.id = id
        } else {
            this.id = -(Math.random() * Number.MAX_SAFE_INTEGER)
        }
        if (startingCode) {
            this.startingCode = startingCode
        } else {
            this.startingCode = ""
        }
        this.title = title;
        this.description = description;
        this.result = result;
        this.startTime = startTime;
        this.soloEndTime = soloEndTime;
        this.endTime = endTime;
        this.courseId = courseId;
        this.notation = notation;
        this.answeredQuestions = false;
    }
}

export default Exercise;
