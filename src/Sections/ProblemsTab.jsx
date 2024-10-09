import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import {Select, SelectItem, Button, Chip, Input, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Progress, Pagination, Link, Spinner} from "@nextui-org/react"
import pickOneIcon from "../assets/pickOneIcon.svg"
import tagIcon from "../assets/tagIcon.svg"
import difficultyIcon from "../assets/difficultyIcon.svg"
import statusIcon from "../assets/statusIcon.svg"
import globeIcon from "../assets/globeIcon.svg"
import searchIcon from "../assets/searchIcon.svg"
// import checkIcon from "../assets/checkIcon.svg"
// import exclamationIcon from "../assets/exclamationIcon.svg"
import useDebounce from "../hooks/useDebounce"

import {colorMap, startContentForProblemStatus} from "../themes/problemPropsDisplaySettings"
import {formatFieldName, textMapForProblemStatus} from "../lib/utils"
import { useProblems } from "../services/queries"

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

const ProblemsTab = ({className}) => {

    console.log("Problems Tab rerendered")

    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    
    const [difficultyFilter, setDifficultyFilter] = useState(new Set([]))
    const [statusFilter, setStatusFilter] = useState(new Set([]))
    const [searchInputValue, setSearchInputValue] = useState("")
    const searchValue = useDebounce(searchInputValue, 400)

    const {isLoading, isFetching, data, error} = useProblems(page, rowsPerPage, {
        searchValue,
        difficulty: difficultyFilter,
        status: statusFilter
    })

    if (data) {
        console.log("Problems from query")
        console.log(data)
    }

    if (error){
        console.error("Error fetching problems")
        console.error(error)
    }

    const handleRowsPerPageChange = (e) =>{
        setRowsPerPage(parseInt(e.target.value))
        if (page != 1) {
            setPage(1)
        }
    }

    console.log(difficultyFilter)
    console.log(statusFilter)

    const handleFilterChange = (key, value) => {
        if (key === "difficulty-filter") {
            setDifficultyFilter(value)
        }
        else if (key === "status-filter") {
            setStatusFilter(value)
        }
        
        if (page != 1) {
            setPage(1)
        }
    }

    // useEffect(() => {
    //     console.log("Setting page")
    //     setPage(1)
    // }, [rowsPerPage, searchValue, difficultyFilter, statusFilter])
    
    const totalPages = useMemo(() => {
        return Math.ceil((data?.total ?? 0) / rowsPerPage);
    }, [data?.total, rowsPerPage]);
    

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
                    <Chip color={colorMap[cellValue]} variant="flat" size="sm">{formatFieldName(cellValue)}</Chip>
                );
            case "status":
                return (
                    <Chip startContent={<img src={startContentForProblemStatus[cellValue]}/>} color="text-text-gray" variant="light">
                        {textMapForProblemStatus[cellValue]}
                    </Chip>
                );
            default:
                return cellValue;
        }
      }, []);

    return <div id="problem-of-the-day-container" className="w-[1008px] flex justify-center pb-8">
            {
                error? <p className="text-text-gray text-large">Something went wrong !!</p>:
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
                                {data?.total ?? 0} total
                            </Chip>
                            <p className="mt-2 text-sm text-text-gray">Get questions for practice here</p>
                        </div>
                        <div className="flex gap-4">
                            <Button size="sm" color="primary" radius="md" startContent={<span><img src={pickOneIcon} className="w-5"/></span>} className="font-medium">Pick one</Button>
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
                            selectedKeys={[...difficultyFilter]}
                            onSelectionChange={(e) => handleFilterChange("difficulty-filter", e)}
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
                            <SelectItem key="EASY">Easy</SelectItem>
                            <SelectItem key="MEDIUM">Medium</SelectItem>
                            <SelectItem key="HARD">Hard</SelectItem>
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
                            <SelectItem >Topic 1</SelectItem>
                            <SelectItem >Topic 2</SelectItem>
                            <SelectItem >Topic 3</SelectItem>
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
                            <SelectItem >Company 1</SelectItem>
                            <SelectItem >Company 2</SelectItem>
                            <SelectItem >Company 3</SelectItem>
                        </Select>
                        <Select
                            aria-label="status-filter"
                            variant="bordered"
                            placeholder="Status"
                            selectionMode="multiple"
                            selectedKeys={[...statusFilter]}
                            onSelectionChange={(e) => handleFilterChange("status-filter", e)}
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
                                        disallowEmptySelection
                                        defaultSelectedKeys={["10"]}
                                        selectedKeys={[String(rowsPerPage)]}
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
                            <TableBody 
                                items={data?.problems ?? []} 
                                isLoading={isLoading || isFetching}
                                loadingContent={<Spinner/>}
                                emptyContent={"No rows to display."}>
                                {(item) => (
                                    <TableRow key={item?.problemId}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </section>
                </div>
            }
    </div>
}

export default ProblemsTab