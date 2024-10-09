import axios from "axios";

const BASE_URL = "http://localhost:5000"

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const getProblems = async(page, rows, filtersProps) => {
    return axiosInstance.get(`problemList`).then((response) => {
        const allProblems = response.data
        const filteredProblems = allProblems.filter(problem => {
            const matchSearch = problem.title.toLowerCase().includes(filtersProps.searchValue.toLowerCase())
            const matchDifficulty = filtersProps.difficulty.size === 0 || filtersProps.difficulty.has(problem.difficulty)
            const matchStatus = filtersProps.status.size === 0 || filtersProps.status.has(problem.status)
            return matchSearch && matchDifficulty && matchStatus
        })
        const start = (page - 1) * rows
        const end = start + rows
        return {
            total: filteredProblems.length,
            problems: filteredProblems.slice(start, end)
        }
    })
}

export const getProblemById = async(id) => {
    return new Promise((resolve) =>{
        const mockData = {
            "problemId": id,
            "title":"Storing Water",
            "description": "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p><p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p><p>You can return the answer in any order.</p>",
            "constraints":[
                "-10<sup>9</sup> <= target <= 10<sup>9</sup>",
                "2 <= nums.length <= 10<sup>4</sup>",
                "-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>"
            ],
            "examples":[
                {
                    "input":"nums = [2,7,11,15],    target = 9",
                    "output": "[0,1]",
                    "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
                },
                {
                    "input":"nums = [3,3],    target = 6",
                    "output": "[0,1]"
                },
                {
                    "input":"nums = [3,2,4],    target = 6",
                    "output": "[1,2]"
                }
            ],
            "difficulty": "HARD",
            "codeSnippets":{
                "JAVA": "class Solution{\npublic int[] twoSum(int[] nums, int target){\n\n}\n}",
                "CPP": "vector<int> twoSum(vector<int>& nums, int target) {\n\n}"
            },
            "nextProblemId": 3,
            "acceptedCount": 3,
            "submissionCount": 6,
            "status": "NATT"
        }
        setTimeout(() => {
            resolve(mockData)
        }, 2000)
    })
}