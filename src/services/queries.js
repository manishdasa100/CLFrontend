import { useQuery, useMutation } from "react-query"
import { getARandomProblemId, getProblemById, getProblemOfTheDay, getProblems, executePersonalRun, executeSubmission } from "./api"

export const useProblemsData = (page, limit, filters) => {
    return useQuery(
        ["problemList", page, limit, filters.searchValue, [...filters.difficulty], [...filters.status]],
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
    return useQuery(
        "problemOfTheDay",
        () => getProblemOfTheDay()
    )
}

export const useExecutePersonalRunMutation = () => {
    return useMutation((payload) => executePersonalRun(payload))
}

export const useExecuteSubmissionMutation = () => {
    return useMutation((payload) => executeSubmission(payload))
}