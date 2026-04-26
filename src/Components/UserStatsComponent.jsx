import { Chip } from "@nextui-org/react";
import PieIcon from "../assets/pieIcon.svg";
import DonutChart from "./DonutChart";

export default function UserStatsComponent() {
    return (
        <div className="w-[457px] h-[170px] px-6 py-2 rounded-xl bg-[#0E1116]">
            <Chip variant="light" startContent={<img src={PieIcon}/>}
                classNames={{
                    base:"gap-1",
                    content: "text-ivory-blue font-bold"
                }}
            >Your stats</Chip>

            <div className="h-max flex justify-between items-center">
                <div className="flex-1">
                    <DonutChart height='h-20' width='w-24'/>
                </div>
                <div className="w-fit flex flex-col justify-center items-center">
                    <p><span className="text-3xl text-white font-semibold">314</span><span className="ml-2 text-xs font-bold text-ivory-blue">/ 1200</span></p>
                    <p className="text-ivory-blue text-xs font-semibold">Questions solved</p>
                    <div className="flex mt-3">
                        <div className="text-center pr-2">
                            <p><span className="text-xl text-white font-semibold">56</span><span className="ml-2 text-xs font-semibold text-ivory-blue">/ 350</span></p>
                            <p className="text-ivory-blue text-xs font-semibold mt-1">Easy</p>
                        </div>
                        <div className="text-center px-2 border-x-1 border-ivory-blue">
                            <p><span className="text-xl text-white font-semibold">56</span><span className="ml-2 text-xs font-semibold text-ivory-blue">/ 350</span></p>
                            <p className="text-ivory-blue text-xs font-semibold mt-1">Medium</p>
                        </div>
                        <div className="text-center pl-2">
                            <p><span className="text-xl text-white font-semibold">56</span><span className="ml-2 text-xs font-semibold text-ivory-blue">/ 350</span></p>
                            <p className="text-ivory-blue text-xs font-semibold mt-1">Hard</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}