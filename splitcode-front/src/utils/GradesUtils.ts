enum Notation {
    NONE,
    ONE_TO_SIX,
    PASS_FAIL
}

function getNotation(result: number): string {
    switch (result) {
        case Notation.NONE:
            return "No grades";
        case Notation.ONE_TO_SIX:
            return "Graded from 1 to 6";
        case Notation.PASS_FAIL:
            return "Pass/Fail";
        default:
            return "No grades";
    }
}

function getTrueGrade(type?: number, result?: number) {
    let grade: string
    let gradeColor: string
    let pass: number
    let gradeType: number

    if (type === undefined || result === undefined) {
        gradeColor = "#EFB52EBF"
        grade = "Not evaluated"
        pass = 3
        gradeType = 0
    } else {
        if (type === 1) {
            if (result >= 4) {
                gradeColor = "#05a124"
                pass = 0
                gradeType = 1
            } else {
                gradeColor = "#d31010"
                pass = 1
                gradeType = 2
            }
            grade = result.toString()
        } else if (type === 2) {
            if (result === 0) {
                gradeColor = "#d31010"
                grade = "Failed"
                pass = 1
                gradeType = 2
            } else {
                gradeColor = "#05a124"
                grade = "Passed"
                pass = 0
                gradeType = 1
            }
        } else {
            gradeColor = "#0c68e0"
            grade = "Not graded"
            pass = 0
            gradeType = 1
        }
    }
    return {
        gradeColor: gradeColor,
        grade: grade,
        pass: pass,
        gradeType: gradeType
    }
}

export {getNotation, getTrueGrade};
