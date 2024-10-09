import { useState, useEffect } from "react" 
import { useParams, useLocation } from "react-router-dom"
import { Chip, ScrollShadow, Button, Select, SelectItem, Skeleton } from "@nextui-org/react"
import starVector from "../assets/starVector.svg"
import leftArrow from "../assets/leftArrow.svg"
import rightArrow from "../assets/rightArrow.svg"
import CodeEditor from "../Components/CodeEditor"

import {colorMap, startContentForProblemStatus} from "../themes/problemPropsDisplaySettings"
import {textMapForProblemStatus, formatFieldName, percentisize} from "../lib/utils"

import './ProblemDetailsPage.css'
import { useProblemById } from "../services/queries"

export default function ProblemDetailsPage(){

    console.log("Problem details page rendered")

    const {id} = useParams()

    const [problemDetails, setProblemDetails] = useState(null)

    const [fullScreenEditor, setFullScreenEditor] = useState(false)

    const toggleFullScreenEditor = () => {
        setFullScreenEditor(fullScreenEditor => !fullScreenEditor)
    }

    console.log(id);

    console.log("Full screen editor enabled: " + fullScreenEditor)

    // const fetchProblemDetailsforId = (id) => {
    //     return new Promise((resolve) =>{
    //         const mockData = {
    //             "problemId": id,
    //             "title":"Storing Water",
    //             "description": "<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p><p>You may assume that each input would have exactly one solution, and you may not use the same element twice.</p><p>You can return the answer in any order.</p>",
    //             "constraints":[
    //                 "-10<sup>9</sup> <= target <= 10<sup>9</sup>",
    //                 "2 <= nums.length <= 10<sup>4</sup>",
    //                 "-10<sup>9</sup> <= nums[i] <= 10<sup>9</sup>"
    //             ],
    //             "examples":[
    //                 {
    //                     "input":"nums = [2,7,11,15],    target = 9",
    //                     "output": "[0,1]",
    //                     "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
    //                 },
    //                 {
    //                     "input":"nums = [3,3],    target = 6",
    //                     "output": "[0,1]"
    //                 },
    //                 {
    //                     "input":"nums = [3,2,4],    target = 6",
    //                     "output": "[1,2]"
    //                 }
    //             ],
    //             "difficulty": "EASY",
    //             "codeSnippets":{
    //                 "JAVA": "class Solution{\npublic int[] twoSum(int[] nums, int target){\n\n}\n}",
    //                 "CPP": "vector<int> twoSum(vector<int>& nums, int target) {\n\n}"
    //             },
    //             "nextProblemId": 3,
    //             "acceptedCount": 3,
    //             "submissionCount": 6,
    //             "status": "NATT"
    //         }
    //         setTimeout(() => {
    //             resolve(mockData)
    //         }, 1000)
    //     })
    // }

    // useEffect(() => {

    //     let isMounted = true;

    //     (async () => {

    //         console.log("Getting problem details")

    //         const problemDetails = await fetchProblemDetailsforId(id)
            
    //         if (isMounted) {
    //             console.log("Got problem data")
    //             console.log(problemDetails)
    //             console.log("Setting problem details")
    //             setProblemDetails(problemDetails)
    //         }
    //     })()

    //     return () => {
    //         console.log("Component unmounted")
    //         isMounted = false
    //     };
    // }, [id]);

    const {isLoading, isFetching, data, error} = useProblemById(id)

    console.log("Problem details description")
    console.log(data?.["description"])

    return (
        <div id="problem-details-wrapper" className="w-full h-[calc(100vh-4.5rem)] flex gap-3 px-8 pt-2 pb-5">
            {
                isLoading? <p className="text-text-gray">Loading...</p>:
                <>
                    <div id="left-section" className={fullScreenEditor?"hidden":"basis-2/5 flex flex-col justify-between"}>
                        <ScrollShadow id="problem-details" size={150}  className="flex-auto overflow-y-auto h-[600px] scroll-smooth pr-6 pb-14 text-text-gray" style={{
                            scrollbarWidth:'thin',
                            scrollbarColor:'#555555 #121C31',
                            scrollbarGutter:'stable'
                        }}>
                            <span className="font-medium text-2xl text-white">{data.problemId}. {data.title}</span>
                            <Chip startContent={<img src={startContentForProblemStatus[data.status]}/>} variant="light" className="ml-8 text-text-gray">{textMapForProblemStatus[data.status]}</Chip>
                            <div className="flex justify-between items-center mt-4">
                                <span>
                                    <Chip 
                                        size="sm" 
                                        color={colorMap[data.difficulty]}
                                        variant="flat"
                                        classNames={{
                                            base: "px-2",
                                            content:"font-semibold"
                                        }}
                                    >
                                        {formatFieldName(data.difficulty)}
                                    </Chip>
                                    <span className="ml-6 text-sm"><span className="text-white/80">Acceptance Rate :</span> {percentisize(data.acceptedCount, data.submissionCount)}</span>
                                </span>
                                <span><img src={starVector} alt="star" /></span>
                            </div>
                            <div id="description-content" className="e5 text-sm mt-4 flex flex-col gap-3" dangerouslySetInnerHTML={{__html: data.description}}/>
                            <div id="examples-content" className="flex flex-col gap-4 mt-5">   
                                {
                                    data.examples.map((example, index) => (
                                        <div key={index}>
                                            <p className="font-semibold text-white/80">Example {index + 1}</p>
                                            <div className="text-wrap text-sm pl-4 mt-2 whitespace-pre-wrap border-l-1 border-stroke-gray">
                                                {
                                                    Object.entries(example).map(([key, value]) => (
                                                        <p>
                                                            <span className="font-medium">{formatFieldName(key)}:</span>
                                                            <span className="ml-3">{value}</span> 
                                                        </p>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div id="constraints-content" className="mt-5">
                                <p className="font-semibold text-white/80">Constraints:</p>
                                <ul className="flex flex-col gap-2 mt-2 list-disc">
                                    {
                                        data.constraints.map((constraint) => (
                                            <li className="text-sm"><code className="constraint" dangerouslySetInnerHTML={{__html: constraint}}></code></li>
                                        ))
                                    }
                                </ul>
                            </div>
                            <p className="mt-5">
                                <strong>Follow Up: </strong>
                                <span className="text-sm">Can you come up with an algorithm that is less than O(n2) time complexity?</span>
                            </p>
                            <div id="topics-content" className="mt-4">
                                <p className="font-semibold">Topics:</p>
                                <Chip color="default" size="sm" variant="dot" 
                                classNames={{
                                    base: "px-2 py-3 mr-2 mt-2 text-text-gray"
                                }}>Array</Chip>
                                <Chip color="default" size="sm" variant="dot"
                                classNames={{
                                    base: "px-2 py-3 mr-2 mt-2 text-text-gray"
                                }}>Hash Table</Chip>
                            </div>
                        </ScrollShadow>
                        <div id="problem-navigation" className="h-[40px] flex items-center justify-between">
                            <Button disableRipple variant="light" size="lg" className="text-text-gray data-[hover=true]:bg-transparent p-0" startContent={<img src={leftArrow}/>}>Previous Question</Button>
                            <Button disableRipple variant="light" size="lg" className="text-text-gray data-[hover=true]:bg-transparent p-0" endContent={<img src={rightArrow}/>}>Next Question</Button>
                        </div>
                    </div>
                    <div id="right-section" className={fullScreenEditor?"basis-full flex flex-col gap-3":"basis-3/5 flex flex-col gap-3"}>
                        <div id="code-editor-window" className={fullScreenEditor?"h-full":"h-[70%]"}>
                            <CodeEditor codeSnippets={data.codeSnippets} toggleFullScreenEditor={toggleFullScreenEditor}/>
                        </div>
                        <div id="result-section" className={fullScreenEditor?"hidden":"flex-1 bg-transparent border-1 border-stroke-gray/50 rounded-large"}>
                            <div id="result-section-header" className="pl-4 py-2 border-b-1 border-stroke-gray/50 text-text-gray text-sm font-medium">Testcase Results</div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
} 