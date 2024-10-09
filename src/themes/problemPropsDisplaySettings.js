import checkIcon from "../assets/checkIcon.svg"
import exclamationIcon from "../assets/exclamationIcon.svg"
import minusCircleVector from "../assets/minusCircleVector.svg"

export const colorMap = {
    EASY: "success",
    MEDIUM: "warning",
    HARD: "danger"
};

export const startContentForProblemStatus = {
    ACC: checkIcon,
    ATT: exclamationIcon,
    NATT: minusCircleVector
}
