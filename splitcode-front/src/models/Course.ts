import Exercise from "./Exercise";

class Course {
    id?: number
    name: string
    description: string
    teacherId: number
    semesterId: number
    ects: number
    exercises: Exercise[]

    constructor(name: string, description: string, teacherId: number, semesterId: number, ects: number, id?: number) {
        if (id) {
            this.id = id
        } else {
            this.id = -(Math.random() * Number.MAX_SAFE_INTEGER)
        }
        this.name = name;
        this.description = description;
        this.teacherId = teacherId;
        this.semesterId = semesterId;
        this.ects = ects;
        this.exercises = [];
    }
}

export default Course;
