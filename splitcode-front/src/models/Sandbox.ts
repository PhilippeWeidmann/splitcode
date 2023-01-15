import Attempt from "./Attempt";
import GroupAttempt from "./GroupAttempt";

interface Sandbox {
    id: number
    content: string
    attempt: Attempt
    groupAttempt: GroupAttempt
}

export default Sandbox;
