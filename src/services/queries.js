import { useQuery } from "react-query"
import { getProblemById, getProblems } from "./api"

export const useProblems = (page, limit, filters) => {
    return useQuery(
        ["problemList", page, limit, filters.searchValue, [...filters.difficulty], [...filters.status]],
        () => getProblems(page, limit, filters),
        {
            keepPreviousData: true
        }
    )
}

export const useProblemById = (id) => {
    return useQuery(
        id,
        () => getProblemById(id),
        {
            keepPreviousData: true
        }
    )
}