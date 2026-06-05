import axios from "axios";

const BASE_URL = "http://localhost:3000/api/v1"

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

axiosInstance.interceptors.request.use((config) => {
    const isAuthEndpoint = config.url?.startsWith("auth/")
    if (!isAuthEndpoint) {
        const token = localStorage.getItem("jwtToken")
        if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.startsWith("auth/")
        if (error.response?.status === 401 && !isAuthEndpoint) {
            localStorage.removeItem("jwtToken")
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export const login = async ({ username, password }) => {
    return axiosInstance.post("auth/login", { username, password }).then((res) => res.data)
}

export const register = async ({ username, firstName, lastName, email, password }) => {
    return axiosInstance.post("auth/register", { username, firstName, lastName, email, password }).then((res) => res.data)
}

export const getMe = async () => {
    return axiosInstance.get("me").then((res) => res.data)
}

export const getProblems = async(page, rows, filtersProps) => {
    const params = new URLSearchParams()
    params.append("page", page - 1)
    params.append("size", rows)

    if (filtersProps.difficulty.size > 0)
        params.append("difficulties", [...filtersProps.difficulty].join(","))
    if (filtersProps.topics.size > 0)
        params.append("topics", [...filtersProps.topics].join(","))
    if (filtersProps.companies.size > 0)
        params.append("companies", [...filtersProps.companies].join(","))

    return axiosInstance.get(`problemset/all?${params.toString()}`).then((response) => response.data)
}


export const getProblemById = async(id) => {
    return axiosInstance.get(`problem/${id}`).then((response) => (response.data))
}

export const getARandomProblemId = async() => {
    const randomId = Math.floor(Math.random() * 10) + 1
    return new Promise((resolve, reject) => {
        setTimeout(()=> resolve(randomId), 2000)
    })
}

export const getProblemOfTheDay = async() => {
    return axiosInstance.get(`problem/today`).then((response) => (response.data))
}

export const getAllTopics = async() => {
    return axiosInstance.get(`allTopics`).then((response) => response.data)
}

export const getAllCompanies = async() => {
    return axiosInstance.get(`allCompanies`).then((response) => response.data)
}

export const submitCode = async ({ code, language, problemId, isRunCode }) => {
    const bytes = new TextEncoder().encode(code);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    const userCode = btoa(binary);
    return axiosInstance.post("submission/submit", {
        problemId: Number(problemId),
        language,
        userCode,
        isRunCode,
        b64Encoded: true,
    }).then((res) => res.data);
};

export const checkSubmission = async (submissionId) => {
    return axiosInstance.get(`submission/check/${submissionId}`).then((res) => res.data);
};

export const getUserStreak = async() => {
    return axiosInstance.get(`user/streak`).then((response) => response.data)
}

export const getUserSubmissionStatus = async() => {
    return axiosInstance.get(`user/submission-status`).then((response) => response.data)
}

export const getProblemCounts = async() => {
    return axiosInstance.get(`problem/counts`).then((response) => response.data)
}