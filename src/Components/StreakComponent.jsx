import { Chip } from "@nextui-org/react";
import FireIcon from "../assets/fireIcon.svg";

export default function StreakComponent() {
    return (
        <div className="relative w-[275px] h-[170px] px-6 py-2 flex flex-col justify-between rounded-xl bg-[#0E1116]">
            <Chip variant="light" startContent={<img src={FireIcon}/>}
                classNames={{
                    base:"gap-1",
                    content: "text-ivory-blue font-bold"
                }}
            >Daily solving streak</Chip>

            <div className="w-max text-center mb-2">
                <p className="text-xs text-ivory-blue font-medium">Best streak so far</p>
                <p className="text-lg text-white">14 days</p>
                <p className="text-xs text-ivory-blue font-medium">on 20.02.2023</p>
            </div>

            <div className="absolute right-6 bottom-10 font-bold">
                <span className="text-8xl text-white">7</span>
                <span className="text-white text-xl">days</span>
            </div>
        </div>
    )
}