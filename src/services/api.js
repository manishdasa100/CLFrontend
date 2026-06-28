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

export const getProfileByUsername = async (username) => {
    return axiosInstance.get(`profile/${username}`).then((res) => res.data)
}

export const getOccupations = async () => {
    return axiosInstance.get('occupations').then((res) => res.data)
}

export const updateUserProfile = async (payload) => {
    return axiosInstance.put('user/update', payload).then((res) => res.data)
}

export const uploadProfilePic = async (file) => {
    const formData = new FormData();
    formData.append("profilePictureImageFile", file);
    return axiosInstance.post("user/uploadProfilePic", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    }).then((res) => res.data);
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

export const getSubmissions = async (problemId) => {
    return axiosInstance.get("submissions", { params: { problemId } }).then((res) => res.data);
};

// limit omitted ⇒ backend returns the user's full submission history.
export const getRecentSubmissions = async (limit) => {
    const params = limit != null ? { limit } : undefined;
    return axiosInstance.get("submissions/recent", { params }).then((res) => res.data);
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

export const getUserLists = async (username) => {
    return axiosInstance.get(`lists/${username}`).then((res) => res.data);
};

export const addToList = async ({ id, problemIds }) => {
    return axiosInstance.post("list/add", { id, problemIds }).then((res) => res.data);
};

export const createList = async ({ name, description, isPublic, isPinned }) => {
    return axiosInstance.post("list/create", { name, description, isPublic, isPinned }).then((res) => res.data);
};

export const getGlobalLists = async () => {
    try {
        const res = await axiosInstance.get("lists/global");
        return res.data;
    } catch (err) {
        if (err.response?.status === 404) return [];
        throw err;
    }
};

export const getListDetails = async (username, listName) => {
    return axiosInstance.get(`list/${username}`, { params: { name: listName } }).then((res) => res.data);
};

export const getStudyPlanProgress = async (listId) => {
    try {
        const res = await axiosInstance.get("studyPlan/get", { params: { listId } });
        return res.data;
    } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
    }
};

// Unified mutation endpoint: studyPlan/set?operation=<OP>&listId=<id>.
// Axios rejects any non-2xx, so callers surface err.response.data.message on failure.
export const activateStudyPlan = async (listId) => {
    return axiosInstance.post("studyPlan/set", null, { params: { operation: "ACTIVATE", listId } }).then((res) => res.data);
};

export const resetStudyPlan = async (listId) => {
    return axiosInstance.post("studyPlan/set", null, { params: { operation: "RESET", listId } }).then((res) => res.data);
};

export const deactivateStudyPlan = async (listId) => {
    return axiosInstance.post("studyPlan/set", null, { params: { operation: "DEACTIVATE", listId } }).then((res) => res.data);
};