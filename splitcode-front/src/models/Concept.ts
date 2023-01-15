class Concept {
    id?: number;
    concept: string;
    exerciseId: number;

    constructor(concept: string, exerciseId: number, id?: number) {
        if (id) {
            this.id = id;
        }
        this.concept = concept;
        this.exerciseId = exerciseId;
    }
}

export default Concept;
