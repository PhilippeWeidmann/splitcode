import Axios from 'axios'
import applyCaseMiddleware from 'axios-case-converter';
import Exercise from "../models/Exercise";
import Course from "../models/Course";
import Attempt from "../models/Attempt";
import Cookies from 'universal-cookie';
import User from "../models/User";
import Sandbox from "../models/Sandbox";
import GroupAttempt from "../models/GroupAttempt";
import WebSocketToken from "../models/WebSocketToken";
import Concept from "../models/Concept";
import ChatMessage from "../models/ChatMessage";
import Question from "../models/Question";
import QuestionAttempt from "../models/QuestionAttempt";
import AttemptResult from "../models/AttemptResult";

Axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
Axios.defaults.headers.common['Accept'] = 'application/json';

export class ApiError extends Error {
    status: number
    errors: { [error: string]: [string] }

    constructor(errorResponse: any, status: number) {
        super(errorResponse.message);
        this.status = status
        this.errors = errorResponse.errors
    }
}

enum HTTPMethod {
    GET,
    POST,
    PUT,
    DELETE
}

const API = applyCaseMiddleware(Axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
}))

const cookies = new Cookies();
const APIFetcher = {
    register: async function (name: string, email: string, role: string, password: string): Promise<User> {
        const results = await executeRequest('register', HTTPMethod.POST, {
            name: name,
            email: email,
            role: role,
            password: password
        })
        return results
    },
    login: async function (email: string, password: string, remember: boolean): Promise<User> {
        const results = await executeRequest('login', HTTPMethod.POST, {
            email: email,
            password: password,
            remember: remember
        })
        return results
    },
    logout: async function (): Promise<void> {
        const results = await executeRequest('logout', HTTPMethod.POST, {})
        return results
    },
    getExercises: async function (): Promise<Exercise[]> {
        const results = await executeRequest('api/exercises', HTTPMethod.GET, {})
        return results
    },
    getCourses: async function (): Promise<Course[]> {
        const results = await executeRequest('api/courses', HTTPMethod.GET, {})
        return results
    },
    getCourse: async function (courseId: number): Promise<Course> {
        const results = await executeRequest('api/courses/' + courseId, HTTPMethod.GET, {with: "exercises"})
        return results
    },
    getCourseExercises: async function (courseId: number): Promise<Exercise[]> {
        const results = await executeRequest("api/courses/" + courseId + "/exercises", HTTPMethod.GET, {})
        return results
    },
    createExercise: async function (exercise: Exercise, courseId: number): Promise<Exercise> {
        const results = await executeRequest("api/teacher/me/exercise/create", HTTPMethod.POST, exercise)
        return results
    },
    getExerciseAttempts: async function (courseId: number, exerciseId: number): Promise<Attempt[]> {
        const results = await executeRequest("api/courses/" + courseId + "/exercises/" + exerciseId + "/attempt", HTTPMethod.GET, {})
        return results
    },
    getUser: async function (): Promise<User> {
        const results = await executeRequest("api/user", HTTPMethod.GET, {})
        return results
    },
    addCourse: async function (courseId: number): Promise<Course> {
        const results = await executeRequest("api/student/me/courses", HTTPMethod.POST, {courseId: courseId})
        return results
    },
    removeCourse: async function (courseId: number): Promise<Course> {
        const results = await executeRequest("api/student/me/courses/" + courseId, HTTPMethod.DELETE, {})
        return results
    },
    getStudentCourses: async function (): Promise<Course[]> {
        const results = await executeRequest("api/student/me/courses", HTTPMethod.GET, {})
        return results
    },
    getTeacherCourses: async function (): Promise<Course[]> {
        const results = await executeRequest("api/teacher/me/courses", HTTPMethod.GET, {})
        return results
    },
    getStudentExercise: async function (courseId: number, exerciseId: number): Promise<Exercise> {
        const results = await executeRequest("api/student/me/courses/" + courseId + "/exercises/" + exerciseId, HTTPMethod.GET, {})
        return results
    },
    createStudentAttempt: async function (courseId: number, exerciseId: number): Promise<Attempt> {
        const results = await executeRequest("api/student/me/courses/" + courseId + "/exercises/" + exerciseId + "/attempts", HTTPMethod.POST, {})
        return results
    },
    finishStudentAttempt: async function (attemptId: number): Promise<Attempt> {
        const results = await executeRequest("api/student/me/attempts/" + attemptId, HTTPMethod.PUT, {})
        return results
    },
    finishStudentGroupAttempt: async function (groupAttemptId: number): Promise<GroupAttempt> {
        const results = await executeRequest("api/student/me/groupattempts/" + groupAttemptId, HTTPMethod.PUT, {})
        return results
    },
    getSandbox: async function (sandboxId: number): Promise<Sandbox> {
        const results = await executeRequest("api/student/me/sandboxes/" + sandboxId, HTTPMethod.GET, {})
        return results
    },
    updateSandbox: async function (sandboxId: number, content: string): Promise<Sandbox> {
        const results = await executeRequest("api/student/me/sandboxes/" + sandboxId, HTTPMethod.PUT, {
            id: sandboxId,
            content: content
        })
        return results
    },
    getTeacherExercise: async function (exerciseId: number): Promise<Exercise> {
        const results = await executeRequest("api/teacher/me/exercises/" + exerciseId, HTTPMethod.GET, {})
        return results
    },
    getSandboxFromAttempt: async function (exerciseId: number, attemptId: number): Promise<Sandbox> {
        const results = await executeRequest("api/teacher/me/exercises/" + exerciseId + "/attempts/" + attemptId, HTTPMethod.GET, {})
        return results
    },
    getSandboxFromgroupAttempt: async function (exerciseId: number, attemptId: number): Promise<Sandbox> {
        const results = await executeRequest("api/teacher/me/exercises/" + exerciseId + "/groupAttempts/" + attemptId, HTTPMethod.GET, {})
        return results
    },
    createCourse: async function (course: Course): Promise<Course> {
        const results = await executeRequest("api/teacher/me/course/create", HTTPMethod.POST, course)
        return results
    },
    getGroupAttempt: async function (groupAttemptId: number): Promise<GroupAttempt> {
        const results = await executeRequest("api/student/me/groupattempts/" + groupAttemptId, HTTPMethod.GET, {})
        return results
    },
    getWebSocketToken: async function (groupAttemptId: number): Promise<WebSocketToken> {
        const results = await executeRequest("api/websocket/token", HTTPMethod.GET, {groupAttemptId: groupAttemptId})
        return results
    },
    getAttemptExercise: async function (attemptId: number): Promise<Exercise> {
        const results = await executeRequest("api/student/me/sandboxes/" + attemptId + "/attempt/exercise", HTTPMethod.GET, {})
        return results
    },
    compileCode: async function (code: string): Promise<string> {
        const results = await executeRequest("api/scala/compile", HTTPMethod.POST, {code: code})
        return results
    },
    forgotPassword: async function (email: string): Promise<void> {
        const results = await executeRequest("forgot-password", HTTPMethod.POST, {email: email})
        return results
    },
    updateProfile: async function (email: string, name: string): Promise<User> {
        const results = await executeRequest("update-profile", HTTPMethod.POST, {email: email, name: name})
        return results
    },
    getCourseStudents: async function (courseId: number): Promise<User[]> {
        const results = await executeRequest("api/teacher/me/course/" + courseId + "/students", HTTPMethod.GET, {})
        return results
    },
    getExerciseConcepts: async function (exerciseId: number): Promise<Concept[]> {
        const results = await executeRequest("api/teacher/me/exercises/" + exerciseId + "/concepts", HTTPMethod.GET, {})
        return results
    },
    addConceptsToExercise: async function (courseId: number, exerciseId: number, concepts: Concept[]): Promise<Concept[]> {
        let results = []
        for (const concept of concepts) {
            results.push(await executeRequest("api/courses/" + courseId + "/exercises/" + exerciseId + "/exercise-concepts", HTTPMethod.POST, concept));
        }
        return results
    },
    getAllSingleSandboxesForExercise: async function (exerciseId: number): Promise<Sandbox[]> {
        const results = await executeRequest("api/teacher/me/exercises/" + exerciseId + "/sandboxes/single", HTTPMethod.GET, {})
        return results
    },
    getAllGroupSandboxesForExercise: async function (exerciseId: number): Promise<Sandbox[]> {
        const results = await executeRequest("api/teacher/me/exercises/" + exerciseId + "/sandboxes/group", HTTPMethod.GET, {})
        return results
    },
    getExercise: async function (exerciseId: number): Promise<Exercise> {
        const results = await executeRequest("api/exercises/" + exerciseId, HTTPMethod.GET, {})
        return results
    },
    getChatMessages: async function (groupAttemptId: number): Promise<[ChatMessage]> {
        const results = await executeRequest("api/student/me/groupattempts/" + groupAttemptId + "/messages", HTTPMethod.GET, {})
        return results
    },
    checkInAttempt: async function (attemptId: number): Promise<string> {
        const results = await executeRequest("api/student/me/attempts/" + attemptId + "/checkin", HTTPMethod.PUT, {})
        return results
    },
    checkInGroupAttempt: async function (groupAttemptId: number): Promise<string> {
        const results = await executeRequest("api/student/me/groupattempts/" + groupAttemptId + "/checkin", HTTPMethod.PUT, {})
        return results
    },
    getQuestions: async function (groupAttemptId: number): Promise<Question[]> {
        const results = await executeRequest("api/student/me/groupattempts/" + groupAttemptId + "/questions", HTTPMethod.GET, {})
        return results
    },
    getAttemptForQuestion: async function (exerciseId: number): Promise<GroupAttempt> {
        const results = await executeRequest("api/student/me/exercises/" + exerciseId + "/question/attempt", HTTPMethod.GET, {})
        return results
    },
    createQuestionsAnswer: async function (exerciseId: number, questions: QuestionAttempt[]): Promise<QuestionAttempt[]> {
        let results = []
        for (const answer of questions) {
            results.push(await executeRequest("api/student/me/exercises/" + exerciseId + "/question/create", HTTPMethod.POST, answer));
        }
        return results
    },
    updateGrade: async function (id: number, result: number): Promise<AttemptResult> {
        const results = await executeRequest("api/teacher/me/grade/update", HTTPMethod.PUT, {id: id, result: result})
        return results
    }
}

export default APIFetcher;

async function ensureFreshXSRFToken() {
    let token = cookies.get<string>('XSRF-TOKEN')
    if (token == null) {
        await API.get('sanctum/csrf-cookie', {})
    }
}

async function executeRequest(url: string, type: HTTPMethod, params: any): Promise<any> {
    try {
        let result: any
        switch (type) {
            case HTTPMethod.GET:
                result = await API.get(url, {params: params})
                break
            case HTTPMethod.POST:
                await ensureFreshXSRFToken()
                result = await API.post(url, params)
                break
            case HTTPMethod.PUT:
                await ensureFreshXSRFToken()
                result = await API.put(url, params)
                break
            case HTTPMethod.DELETE:
                await ensureFreshXSRFToken()
                result = await API.delete(url, {params: params})
                break
        }
        return result.data
    } catch (error) {
        let formattedError = error
        if (Axios.isAxiosError(error)) {
            if (error.response) {
                formattedError = new ApiError(error.response.data, error.response.status)
            } else {
                formattedError = new ApiError("Network error", 0)
            }
        }

        if (process.env.NODE_ENV === 'development') {
            // @ts-ignore
            window.onDebugError(formattedError);
        }
        throw formattedError
    }
}
