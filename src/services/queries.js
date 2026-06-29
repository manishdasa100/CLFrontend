import { useQuery, useMutation } from "react-query"
import { getARandomProblemId, getProblemById, getProblemOfTheDay, getProblems, getAllTopics, getAllCompanies, login, register, getUserStreak, getUserSubmissionStatus, getProblemCounts, getUserLists, addToList, createList, getProfileByUsername, getOccupations, updateUserProfile, uploadProfilePic, getGlobalLists, getListDetails, getStudyPlanProgress, activateStudyPlan, resetStudyPlan, deactivateStudyPlan, getSubmissions, getRecentSubmissions, getSubmissionDetails } from "./api"

export const useProblemsData = (page, limit, filters) => {
    return useQuery(
        ["problemList", page, limit, [...filters.difficulty], [...filters.topics], [...filters.companies]],
        () => getProblems(page, limit, filters),
        {
            keepPreviousData: true
        }
    )
}

export const useProblemByIdData = (id) => {
    return useQuery(
        id,
        () => getProblemById(id),
        {
            keepPreviousData: true
        }
    )
}

export const useSubmissions = (problemId) => {
    return useQuery(
        ["submissions", problemId],
        () => getSubmissions(problemId),
        { enabled: !!problemId, staleTime: Infinity }
    )
}

export const useRecentSubmissions = (limit) => {
    return useQuery(
        ["recentSubmissions", limit ?? "all"],
        () => getRecentSubmissions(limit),
        { keepPreviousData: true }
    )
}

export const useSubmissionDetails = (submissionId) => {
    return useQuery(
        ["submissionDetails", submissionId],
        () => getSubmissionDetails(submissionId),
        { enabled: !!submissionId, staleTime: Infinity }
    )
}

export const useARandomProblemId = (onSuccess, onError) => {
    return useQuery(
        "randomProblemId",
        () => getARandomProblemId(),
        {
            enabled: false,
            onSuccess: (data) => {
                onSuccess(data)
            },
            onError: onError
        }
    )
}

export const useProblemOfTheDayData = () => {
    return useQuery("problemOfTheDay",() => getProblemOfTheDay())
}

export const useAllTopics = () => {
    return useQuery("allTopics", getAllTopics, { staleTime: Infinity })
}

export const useAllCompanies = () => {
    return useQuery("allCompanies", getAllCompanies, { staleTime: Infinity })
}


export const useLoginMutation = () => {
    return useMutation((payload) => login(payload))
}

export const useRegisterMutation = () => {
    return useMutation((payload) => register(payload))
}

export const useUserStreak = () => {
    return useQuery("userStreak", getUserStreak)
}

export const useUserSubmissionStatus = () => {
    return useQuery("userSubmissionStatus", getUserSubmissionStatus)
}

export const useProblemCounts = () => {
    return useQuery("problemCounts", getProblemCounts, { staleTime: 30 * 60 * 1000 })
}

export const useUserLists = (username) => {
    return useQuery(["userLists", username], () => getUserLists(username), { enabled: !!username })
}

export const useProfileByUsername = (username) => {
    return useQuery(["profile", username], () => getProfileByUsername(username), { enabled: !!username })
}

export const useOccupations = () => {
    return useQuery("occupations", getOccupations, { staleTime: Infinity })
}

export const useUpdateProfileMutation = () => {
    return useMutation((payload) => updateUserProfile(payload))
}

export const useUploadProfilePicMutation = () => {
    return useMutation((file) => uploadProfilePic(file))
}

export const useAddToListMutation = () => {
    return useMutation((payload) => addToList(payload))
}

export const useCreateListMutation = () => {
    return useMutation((payload) => createList(payload))
}

export const useGlobalLists = () => {
    return useQuery("globalLists", getGlobalLists)
}

export const useListDetails = (username, listName) => {
    return useQuery(
        ["listDetails", username, listName],
        () => getListDetails(username, listName),
        { enabled: !!username && !!listName }
    )
}

export const useStudyPlanProgress = (listId, enabled) => {
    return useQuery(
        ["studyPlanProgress", listId],
        () => getStudyPlanProgress(listId),
        { enabled: !!listId && !!enabled }
    )
}

export const useActivateStudyPlanMutation = () => {
    return useMutation((listId) => activateStudyPlan(listId))
}

export const useResetStudyPlanMutation = () => {
    return useMutation((listId) => resetStudyPlan(listId))
}

export const useDeactivateStudyPlanMutation = () => {
    return useMutation((listId) => deactivateStudyPlan(listId))
}