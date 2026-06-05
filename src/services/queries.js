import { useQuery, useMutation } from "react-query"
import { getARandomProblemId, getProblemById, getProblemOfTheDay, getProblems, getAllTopics, getAllCompanies, login, register, getUserStreak, getUserSubmissionStatus, getProblemCounts } from "./api"

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