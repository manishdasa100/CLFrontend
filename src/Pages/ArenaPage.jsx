import {useMemo, useState} from 'react'
import BackgroundWrapper from "../Components/BackgroundWrapper"
import {
    Tabs,
    Tab 
} from "@nextui-org/react";
import AppNavbar from '../Components/AppNavbar';
import { Outlet, useLocation } from 'react-router-dom';

const ArenaPage = () => {

    const {pathname} = useLocation()

    console.log("PATHNAME: " + pathname)

    const isProblemDetailsPage = useMemo(() => {
        return pathname.match(/^\/arena\/problemset\/\d+$/)
    }, [pathname])

    const selectedKey = useMemo(()=>{
        if (pathname === "/arena/learn") {
            return "learn"
        } else if (pathname === "/arena/study-plans") {
            return "study-plans"
        } else {
            return "problemset"
        }
    }, [pathname])

    console.log("ARENA PAGE RERENDERED AND SELECTED KEY:" + selectedKey)

    return <>
        <AppNavbar/>
        <div id='content-wrapper' className='flex flex-col items-center'>
            {
                !isProblemDetailsPage && (
                    <div id="arena-tabs" className="relative w-[1008px]">
                        <p className='py-0 text-6xl font-bold text-text-gray/[0.07] absolute top-3 right-3'>Your Arena</p>
                        <Tabs 
                            fullWidth={true}
                            defaultSelectedKey="problemset"
                            selectedKey={selectedKey}
                            placement='top'
                            aria-label="Tabs"
                            variant="underlined" 
                            size='lg' 
                            color='primary'
                            classNames={{
                                base:"flex justify-start pt-8 mb-8 border-b-1 border-stroke-gray/30",
                                tabList: "w-2/5 gap-15 relative rounded-none p-0",
                                cursor: "w-full bg-[#22d3ee]",
                                tab: "px-0 h-12",
                                tabContent: "text-[#aaaaaa] group-data-[selected=true]:text-[#ffffff]"
                            }}
                        >
                            <Tab key="learn" href='/arena/learn' title="Learn"></Tab>
                            <Tab key="study-plans" href='/arena/study-plans' title="Study Plans"></Tab>
                            <Tab key="problemset" href='/arena/problemset' title="Problems"></Tab>
                        </Tabs>
                    </div>
                )
            }
            <Outlet/>
        </div>   
    </>
}

export default ArenaPage


