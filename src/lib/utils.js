export const textMapForProblemStatus = {
    ACC: "Solved",
    ATT: "Attempted",
    NATT: "Unattempted"
}

export const languageCodes = {
    java: "JAVA",
    python: "PYTHON",
    cpp:"CPP",
    c: "C",
    golang:"GO",
    javascript: "JAVASCRIPT",
    rust:"RUST"
}

export const formatFieldName = (field) => {
    if (field === undefined) return
    return field.charAt(0).toUpperCase() + field.slice(1).toLowerCase();
}

export const percentisize = (num, deno) => {
    return ((num / deno) * 100).toFixed(0) + "%"
}