import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import {Select, SelectItem, Button, Chip, Input, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Progress, Pagination, Link} from "@nextui-org/react"
import pickOneIcon from "../assets/pickOneIcon.svg"
import tagIcon from "../assets/tagIcon.svg"
import difficultyIcon from "../assets/difficultyIcon.svg"
import statusIcon from "../assets/statusIcon.svg"
import globeIcon from "../assets/globeIcon.svg"
import searchIcon from "../assets/searchIcon.svg"
import checkIcon from "../assets/checkIcon.svg"
import exclamationIcon from "../assets/exclamationIcon.svg"
import useDebounce from "../hooks/useDebounce"

const columns = [
    {
        key:"problemId",
        label:"Id"
    },
    {
        key:"title",
        label:"Title"
    },
    {
        key:"acceptance",
        label:"Acceptance"
    },
    {
        key:"difficulty",
        label:"Difficulty"
    },
    {
        key:"status",
        label:"Status"
    },
]

const colorMap = {
    Easy: "success",
    Medium: "warning",
    Hard: "danger"
};

const startContentMapForStatus = {
    ACC: checkIcon,
    ATT: exclamationIcon
}

const textMapForStatus = {
    ACC: "Solved",
    ATT: "Attempted",
    NATT: "Unsolved"
}

const problemList = [
    {
        problemId: 1,
        title: "Build a Matrix With Conditions",
        difficulty: "Easy",
        acceptance:54,
        status: "ACC",
    },
    {               
        problemId: 2,
        title: "Two Sum",
        difficulty: "Medium",
        acceptance:64,
        status: "ACC"
    },
    {
        problemId: 3,
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        acceptance:24,
        status: "ACC"
    },
    {
        problemId: 4,
        title: "Median of Two Sorted Arrays",
        difficulty: "Medium",
        acceptance:84,
        status: "ACC"
    },
    {
        problemId: 5,
        title: "Longest Palindromic Substring",
        difficulty: "Easy",
        acceptance:14,
        status: "NATT"
    },
    {
        problemId: 6,
        title: "Zigzag Conversion",
        difficulty: "Easy",
        acceptance:64,
        status: "NATT"
    },
    {
        problemId: 7,
        title: "Palindrome Number",
        difficulty: "Medium",
        acceptance:74,
        status: "ACC",
    },
    {
        problemId: 8,
        title: "Roman to Integer",
        difficulty: "Easy",
        acceptance:64,
        status: "NATT"
    },
    {
        problemId: 9,
        title: "Longest Common Prefix",
        difficulty: "Medium",
        acceptance:44,
        status: "ATT"
    },
    {
        problemId: 10,
        title: "Valid Parentheses",
        difficulty: "Hard",
        acceptance:34,
        status: "NATT"
    },
    {
        problemId: 11,
        title: "Merge Two Sorted Lists",
        difficulty: "Medium",
        acceptance:54,
        status: "ACC"
    },
    {
        problemId: 12,
        title: "Remove Duplicates from Sorted Array",
        difficulty: "Medium",
        acceptance:24,
        status: "NATT"
    },
    {
        problemId: 13,
        title: "Remove Element",
        difficulty: "Medium",
        acceptance:94,
        status: "NATT"
    },
    {
        problemId: 14,
        title: "Find the Index of the First Occurrence in a String",
        difficulty: "Easy",
        acceptance:44,
        status: "ATT"
    },
    {
        problemId: 15,
        title: "Search Insert Position",
        difficulty: "Easy",
        acceptance:34,
        status: "ATT"
    },
    {
        problemId: 16,
        title: "Plus One",
        difficulty: "Hard",
        acceptance:54,
        status: "ATT"
    },
    {
        problemId: 17,
        title: "Add Binary",
        difficulty: "Hard",
        acceptance:34,
        status: "ACC"
    },
    {
        problemId: 18,
        title: "Sqrt(x)",
        difficulty: "Medium",
        acceptance:84,
        status: "NATT"
    },
    {
        problemId: 19,
        title: "Climbing Stairs",
        difficulty: "Easy",
        acceptance:64,
        status: "ACC"
    },
    {
        problemId: 20,
        title: "Binary Tree Inorder Traversal",
        difficulty: "Medium",
        acceptance:14,
        status: "ACC"
    },
    {
        problemId: 21,
        title: "Same Tree",
        difficulty: "Medium",
        acceptance:34,
        status: "NATT"
    },
    {
        problemId: 22,
        title: "Symmetric Tree",
        difficulty: "Medium",
        acceptance:44,
        status: "NATT"
    },
    {
        problemId: 23,
        title: "Maximum Depth of Binary Tree",
        difficulty: "Hard",
        acceptance:54,
        status: "NATT"
    },
    
]

const ProblemsTab = ({className}) => {

    console.log("Problems Tab rerendered")

    const [problems, setProblems] = useState([])
    const [totalProblems, setTotalProblems] = useState(0)
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState("10")
    const [difficultyFilter, setDifficultyFilter] = useState(new Set([]))
    const [statusFilter, setStatusFilter] = useState(new Set([]))
    const [searchInputValue, setSearchInputValue] = useState("")
    const [tableDataLoading, setTableDataLoading] = useState(true)

    const handleRowsPerPageChange = (e) =>{
        setRowsPerPage(e.target.value)
    }

    const getMockData = (pageNo, rows, {searchValue, difficulty, status}) => {
        const start = (pageNo - 1) * parseInt(rows)
        const end = start + parseInt(rows)
        const filteredProblems = problemList.filter(problem => {
            const matchSearch = problem.title.toLowerCase().includes(searchValue.toLowerCase())
            const matchDifficulty = difficulty.size === 0 || difficulty.has(problem.difficulty)
            const matchStatus = status.size === 0 || status.has(problem.status)
            return matchSearch && matchDifficulty && matchStatus
        })
        return new Promise((resolve) =>{
            const mockData = {
                total: filteredProblems.length,
                problems: filteredProblems.slice(start, end)
            }
            setTimeout(() => {
                resolve(mockData)
            }, 1000)
        })
    }

    console.log(difficultyFilter)
    console.log(statusFilter)
    
    const searchValue = useDebounce(searchInputValue, 400)

    useEffect(() => {

        let isMounted = true;

        (async () => {
            console.log("Setting up problem list...")

            //Fetch data from API server
            const {total, problems} = await getMockData(
                page, 
                rowsPerPage, 
                {
                    searchValue: searchValue, 
                    difficulty: difficultyFilter, 
                    status: statusFilter
                }
            )
            
            if (isMounted) {
                console.log(`Got problem list: ${total}`)
                console.log(problems)
                setProblems(problems)
                setTotalProblems(total)
                setTableDataLoading(false)
            }
        })()

        return () => {
            console.log("Component unmounted")
            isMounted = false
        };
    },[rowsPerPage, page, searchValue, difficultyFilter, statusFilter])

    useEffect(() => {
        console.log("Setting page")
        setPage(1)
    }, [rowsPerPage, searchValue, difficultyFilter, statusFilter]) 

    const totalPages = useMemo(() => {
        return Math.ceil(totalProblems/parseInt(rowsPerPage))  
    }, [totalProblems, rowsPerPage])

    console.log(`totalPages ${totalPages}`)

    console.log(searchValue)

    const renderCell = useCallback((problem, columnKey) => {
        const cellValue = problem[columnKey];
    
        switch (columnKey) {
            case "title":
                return <Link href={`/arena/problemset/${problem.problemId}`} size="sm" className="text-text-gray hover:text-primary hover:opacity-100">{cellValue}</Link>   
            case "acceptance":
                return (
                <Progress size="sm" value={cellValue} showValueLabel={true}
                    classNames={{
                        base:"w-[150px] flex flex-row items-center",
                        labelWrapper:"w-max",
                        value:"text-xs",
                        track:"grow order-first bg-slate-300"
                    }}
                />
                );
            case "difficulty":
                return (
                    <Chip color={colorMap[cellValue]} variant="flat" size="sm">{cellValue}</Chip>
                );
            case "status":
                if (cellValue == "NATT") {
                    return <span className="text-text-gray/50">{textMapForStatus[cellValue]}</span>
                }
                return (
                <Chip startContent={<img src={startContentMapForStatus[cellValue]}/>} color="text-text-gray" variant="light">
                    {textMapForStatus[cellValue]}
                </Chip>
                );
            default:
                return cellValue;
        }
      }, []);

    return <div id="problem-of-the-day-container" className={`flex justify-center ${className}`}>
        <div id="table-container" className="w-full rounded-2xl border-1 border-stroke-gray/30">
            <section id="title-section" className="flex justify-between items-center px-8 py-5 border-b-1 border-stroke-gray/30">
                <div>
                    <span className="text-lg font-semibold text-white">Problems</span>
                    <Chip 
                        size="sm" 
                        color="primary" 
                        classNames={{
                            base: "bg-slate-600/30 ml-3 px-2 text-primary-blue",
                            content:"font-semibold"
                        }}
                    >
                        {totalProblems} total
                    </Chip>
                    <p className="mt-2 text-sm text-text-gray">Get questions for practice here</p>
                </div>
                <div className="flex gap-4">
                    <Button size="sm" color="primary" radius="md" startContent={<span><img src={pickOneIcon} className="w-5"/></span>} className="font-Medium">Pick one</Button>
                </div>
            </section>
            <section className="px-8 py-5 flex gap-3 text-text-gray border-b-1 border-stroke-gray/30">
                <Input variant="bordered" placeholder="Search question..." 
                    classNames={{
                        base:"w-1/3 border-1 border-stroke-gray/30 rounded-xl",
                        innerWrapper:"border-0",
                        inputWrapper: [
                            "border-0",
                            "hover:border-0",
                            "group-data-[focus=true]:border-stroke-gray/30",
                        ],
                    }}
                    endContent={<img src={searchIcon} className="w-[14px]"/>}
                    onValueChange={setSearchInputValue}
                />
                <Select
                    aria-label="difficulty-filter"
                    variant="bordered"
                    placeholder="Difficulty"
                    selectionMode="multiple"
                    selectedKeys={difficultyFilter}
                    onSelectionChange={setDifficultyFilter}
                    className="basis-1/5"
                    startContent={<img src={difficultyIcon} className="w-3"/>}
                    classNames={{
                        mainWrapper:"border-1 border-stroke-gray/30 rounded-xl",
                        trigger: [
                            "bg-transparent", 
                            "data-[hover=true]:bg-transparent border-0",
                        ],
                        popoverContent:"bg-zinc-950 border-1 border-stroke-gray/30",
                    }}

                    listboxProps={{
                        itemClasses: {
                          base: [
                            "text-text-gray",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "data-[selectable=true]:focus:bg-gray-400",
                            "data-[pressed=true]:opacity-70",
                          ],
                        },
                    }}
                >
                    <SelectItem key="Easy">Easy</SelectItem>
                    <SelectItem key="Medium">Medium</SelectItem>
                    <SelectItem key="Hard">Hard</SelectItem>
                </Select>
                <Select
                    aria-label="topics-filter"
                    variant="bordered"
                    placeholder="Topics"
                    selectionMode="multiple"
                    className="basis-1/5"
                    startContent={<img src={tagIcon} className="w-3"/>}
                    classNames={{
                        mainWrapper:"border-1 border-stroke-gray/30 rounded-xl",
                        trigger: [
                            "bg-transparent", 
                            "data-[hover=true]:bg-transparent border-0",
                        ],
                        popoverContent:"bg-zinc-950 border-1 border-stroke-gray/30",
                    }}

                    listboxProps={{
                        itemClasses: {
                          base: [
                            "text-text-gray",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "data-[selectable=true]:focus:bg-gray-400",
                            "data-[pressed=true]:opacity-70",
                          ],
                        },
                    }}
                >
                    <SelectItem >Easy</SelectItem>
                    <SelectItem >Medium</SelectItem>
                    <SelectItem >Hard</SelectItem>
                </Select>
                <Select
                    aria-label="company-filter"
                    variant="bordered"
                    placeholder="Company"
                    selectionMode="multiple"
                    className="basis-1/5"
                    startContent={<img src={globeIcon} className="w-3"/>}
                    classNames={{
                        mainWrapper:"border-1 border-stroke-gray/30 rounded-xl",
                        trigger: [
                            "bg-transparent", 
                            "data-[hover=true]:bg-transparent border-0",
                        ],
                        popoverContent:"bg-zinc-950 border-1 border-stroke-gray/30",
                    }}

                    listboxProps={{
                        itemClasses: {
                          base: [
                            "text-text-gray",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "data-[selectable=true]:focus:bg-gray-400",
                            "data-[pressed=true]:opacity-70",
                          ],
                        },
                    }}
                >
                    <SelectItem >Easy</SelectItem>
                    <SelectItem >Medium</SelectItem>
                    <SelectItem >Hard</SelectItem>
                </Select>
                <Select
                    aria-label="status-filter"
                    variant="bordered"
                    placeholder="Status"
                    selectionMode="multiple"
                    onSelectionChange={setStatusFilter}
                    className="basis-1/5"
                    startContent={<img src={statusIcon} className="w-3"/>}
                    classNames={{
                        mainWrapper:"border-1 border-stroke-gray/30 rounded-xl",
                        trigger: [
                            "bg-transparent", 
                            "data-[hover=true]:bg-transparent border-0",
                        ],
                        popoverContent:"bg-zinc-950 border-1 border-stroke-gray/30",
                    }}

                    listboxProps={{
                        itemClasses: {
                          base: [
                            "text-text-gray",
                            "transition-opacity",
                            "data-[hover=true]:text-foreground",
                            "data-[selectable=true]:focus:bg-gray-400",
                            "data-[pressed=true]:opacity-70",
                          ],
                        },
                    }}
                >
                    <SelectItem key="ACC">Solved</SelectItem>
                    <SelectItem key="ATT">Attempted</SelectItem>
                    <SelectItem key="NATT">Not attempted</SelectItem>
                </Select>
            </section>
            <section className="px-8 py-5">
                <Table 
                    removeWrapper 
                    aria-label="Problem list table"
                    classNames={{
                        th:"bg-slate-700/20 text-text-gray",
                        tbody:"text-text-gray",
                    }}
                    bottomContent={
                        <div className="flex w-full justify-between mt-5">
                            <Select
                                aria-label="rows-per-page"
                                defaultSelectedKeys={["10"]}
                                selectedKeys={[rowsPerPage]}
                                variant="bordered"
                                labelPlacement="outside-left"
                                label="Rows: "
                                size="sm"
                                classNames={{
                                    base:"w-min flex items-center",
                                    mainWrapper:"border-1 border-stroke-gray/30 rounded-xl",
                                    label:"text-text-gray text-sm",
                                    trigger:"w-[60px] data-[hover=true]:bg-transparent border-0 bg-transparent",
                                    value:"text-[12px]",
                                    popoverContent:"bg-zinc-950 border-1 border-stroke-gray/30",
                                }}
                                listboxProps={{
                                    itemClasses: {
                                      base:[
                                        "px-1",
                                        "text-text-gray",
                                        "transition-opacity",
                                        "data-[hover=true]:text-foreground",
                                        "data-[selectable=true]:focus:bg-gray-400",
                                        "data-[pressed=true]:opacity-70",
                                      ],
                                      title: [
                                        "text-[12px]"
                                      ],
                                    },
                                  }}
                                onChange={handleRowsPerPageChange}
                            >
                                <SelectItem key="10">10</SelectItem>
                                <SelectItem key="20">20</SelectItem>
                                <SelectItem key="30">30</SelectItem>
                            </Select>
                            <Pagination
                                initialPage={1}
                                variant="bordered"
                                showControls
                                page={page}
                                total={totalPages}
                                onChange={(page) => setPage(page)}
                                classNames={{
                                    item:"data-[hover=true]:bg-slate-700 text-small border-stroke-gray/30 text-text-gray",
                                    prev:"bg-slate-700/20 text-text-gray data-[disabled=true]:text-text-gray/20",
                                    next:"bg-slate-700/20 text-text-gray data-[disabled=true]:text-text-gray/20"
                                }}
                            />
                        </div>
                    }
                >
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={problems} emptyContent={"No rows to display."}>
                        {(item) => (
                            <TableRow key={item.problemId}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </section>
        </div>
    </div>
}

export default ProblemsTab