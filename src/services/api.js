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
            // Full reload (not a router navigate) so every cached query is dropped
            // with the token — but carry where they were and why, so the login page
            // can explain itself and send them back, same as ProtectedRoute does.
            const here = window.location.pathname + window.location.search
            const onAuthPage = /^\/(login|signup)\b/.test(window.location.pathname)
            window.location.href = onAuthPage
                ? "/login"
                : `/login?next=${encodeURIComponent(here)}&reason=expired`
        }
        return Promise.reject(error)
    }
)

// The viewer's IANA timezone (e.g. "Asia/Kolkata", "Europe/London"), sent to
// endpoints whose result depends on the user's local day (streaks, submissions).
const userTimezone = () => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone
    } catch {
        return undefined
    }
}

export const login = async ({ username, password }) => {
    return axiosInstance.post("auth/login", { username, password }).then((res) => res.data)
}

export const register = async ({ username, firstName, lastName, email, password }) => {
    return axiosInstance.post("auth/register", { username, firstName, lastName, email, password, zoneId: userTimezone() }).then((res) => res.data)
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

// Picks a genuinely random problem out of the real catalog: one unfiltered row
// tells us how many there are, then we fetch a single row at a random offset.
// (It used to return Math.random()*10, which ignored the catalog entirely and
// could land on an id that doesn't exist.)
const NO_FILTERS = { difficulty: new Set(), topics: new Set(), companies: new Set() }

export const getARandomProblemId = async() => {
    const first = await getProblems(1, 1, NO_FILTERS)
    const total = first?.total ?? 0
    if (total < 1) return null

    const page = Math.floor(Math.random() * total) + 1
    const picked = page === 1 ? first : await getProblems(page, 1, NO_FILTERS)
    return picked?.entities?.[0]?.id ?? null
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
    }, {
        headers: { "X-Timezone": userTimezone() },
    }).then((res) => res.data);
};

export const checkSubmission = async (submissionId) => {
    return axiosInstance.get(`submission/check/${submissionId}`).then((res) => res.data);
};

export const getSubmissions = async (problemId) => {
    return axiosInstance.get("submissions", { params: { problemId } }).then((res) => res.data);
};

// Scoped to a given profile via username; limit omitted ⇒ full history.
export const getRecentSubmissions = async (username, limit) => {
    const params = { username };
    if (limit != null) params.limit = limit;
    return axiosInstance.get("submissions/recent", { params }).then((res) => res.data);
};

export const getSubmissionDetails = async (submissionId) => {
    return axiosInstance.get(`submission/${submissionId}`).then((res) => res.data);
};

export const getUserStreak = async() => {
    return axiosInstance.get(`user/streak`, { headers: { "X-Timezone": userTimezone() } }).then((response) => response.data)
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

// AI hints, for the Houston panel on the problem page.
// These three sit at the server root rather than under /api/v1, so they override
// baseURL per request instead of getting their own axios instance — that way they
// keep this instance's auth header and its 401-expiry redirect.
// generate/ and latest/ return one hint object; history/ returns them grouped by
// verdict, { WA: [...], TLE: [...] }. Any non-2xx body carries only `message`.
const ROOT_URL = BASE_URL.replace(/\/api\/v1\/?$/, "");

export const generateHint = async (problemId) => {
    return axiosInstance.post(`ai/hint/generate/${problemId}`, null, { baseURL: ROOT_URL }).then((res) => res.data);
};

export const getLastHint = async (problemId) => {
    return axiosInstance.get(`ai/hint/latest/${problemId}`, { baseURL: ROOT_URL }).then((res) => res.data);
};

export const getHintHistory = async (problemId) => {
    return axiosInstance.get(`ai/hint/history/${problemId}`, { baseURL: ROOT_URL }).then((res) => res.data);
};