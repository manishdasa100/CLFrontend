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


    return <BackgroundWrapper>
        <AppNavbar/>
        <div id='content-wrapper' className='w-full flex justify-center items-center'>
            <div id="content" className="relative w-2/3">
                {
                    !isProblemDetailsPage && (
                        <>
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
                                <Tab key="learn" href='/arena/learn' title="Learn">
                                    {/* <LearnTab className="mt-8"/> */}
                                </Tab>
                                <Tab key="study-plans" href='/arena/study-plans' title="Study Plans">
                                    {/* <StudyPlans className="mt-8"/> */}
                                </Tab>
                                <Tab key="problemset" href='/arena/problemset' title="Problems">
                                    {/* <ProblemsTab className="mt-8"/> */}
                                </Tab>
                            </Tabs>
                        </>
                    )
                }
                <Outlet/>
            </div>
        </div>    
    </BackgroundWrapper>
}

export default ArenaPage


