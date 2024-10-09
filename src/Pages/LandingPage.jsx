import Logo from '../assets/Logo.svg';
import {Button, Link} from "@nextui-org/react";
import HeroBackground from '../Components/HeroBackground';
import QuestionsSVG from '../assets/QuestionSVG.svg';
import LanguageSupportSVG from '../assets/LanguageSupportSVG.svg';
import PerformanceTrackingSVG from '../assets/PerformanceTrackingSVG.svg';
import GithubLogo from '../assets/iconGithub.svg';
import heartVector from '../assets/heartVector.svg';
import Footer from '../Components/Footer';
import BackgroundWrapper from '../Components/BackgroundWrapper';

import { useState } from'react';
import AppNavbar from '../Components/AppNavbar';

function LandingPage() {
    const [user, setUser] = useState({
        username:'user1',
        email: 'user1@gmail.com',
        role:'USER',
        isLoggedIn: true,
        profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    })
    return <BackgroundWrapper>
        {/* <div className="px-64 pt-10 pb-24 min-h-full "> */}
            {/* <div id='top-section' className='flex items-center justify-between'>
                <img src={Logo} className='flex-initial' alt='Logo'/>
                <Button as={Link} href='/login' color='primary' variant='bordered' className='z-10'>Sign In</Button>
                {user.isLoggedIn? "Hello": "World"}
            </div> */}
            <AppNavbar/>
            <div className='w-[1008px]'>
                <div id='hero-section' className='relative h-[700px] flex justify-center items-center -translate-y-0'>
                    <div className='w-full h-full absolute'>
                        <HeroBackground/>
                    </div>
                    <div className='absolute w-[700px] text-center z-50'>
                        <p className='text-6xl font-bold text-white drop-shadow-lg'>Crack the <span className='text-[#1b88ff] drop-shadow-lg'>Code</span></p>
                        <p className='mt-8 text-text-gray/70 text-lg leading-relaxed drop-shadow-md'>Acecode helps you crack the code to your coding career by expanding your knowledge and preparing you for technical interviews. Solve challenging problems, and level up your programming skills to ace your next opportunity.</p>
                        <div className='flex justify-center mt-8'>
                            <Button as={Link} href={user.isLoggedIn?'/arena/problemset':'/signup'} color="primary" variant='shadow' size='lg' className='font-semibold'>{user.isLoggedIn?'Go to Arena': 'Create Account'}</Button>
                        </div>
                    </div>
                </div>
                <div id='features_section' className='flex flex-col items-center backdrop-blur-3xl mt-20'>
                    <div className='flex justify-between tracking-wide'>
                        <div className='basis-1/2 flex-auto flex flex-col pr-24 border-r-1 border-stroke-gray/30'>
                            <img src={QuestionsSVG} alt='question-svg' className='w-10'></img>
                            <p className='text-2xl font-bold text-primary-green mt-5'>Questions</p>
                            <p className='text-base text-text-gray/70 mt-7'>Challenge yourself with over 1000 thoughtfully crafted questions on a range of topics. Whether you are a beginner or a seasoned developer you can find problems tailored to your level. </p>
                            <Link isBlock showAnchorIcon href="#" color="primary" className='mt-5 font-semibold w-fit -translate-x-2'>View Questions</Link>
                        </div>
                        <div className='basis-1/2 flex flex-auto flex-col pl-24'>
                            <img src={LanguageSupportSVG} alt='question-svg' className='w-14'></img>
                            <p className='text-2xl font-bold text-primary-green mt-5'>Language Support</p>
                            <p className='text-base text-text-gray/70 mt-7'>Our platform now supports 14 popular coding languages! From Python to Rust, you can now practice and improve your skills in your preferred language. Start coding in your language of choice today. </p>
                            <Link isBlock showAnchorIcon href="#" color="primary" className='mt-5 font-semibold w-fit -translate-x-2'>View Supported Languages</Link>
                        </div>
                    </div>
                    <div className='w-[70%] flex flex-col justify-center items-center text-center mt-28'>
                        <img src={PerformanceTrackingSVG}/>
                        <p className='text-2xl font-bold text-primary-green mt-5'>Performance Tracking</p>
                        <p className='text-base text-text-gray/70 mt-7'>Track your progress and monitor your improvement. Your profile becomes a comprehensive showcase of your coding journey, reflecting your growing skills and achievements. </p>
                        <Link isBlock showAnchorIcon href="#" color="primary" className='mt-5 font-semibold w-fit -translate-x-2'>View Your Profile</Link>
                    </div>
                </div>
            </div>
        {/* </div> */}
        <div id='bottom-section' className='flex flex-col items-center bg-white py-24 mt-24'>
            <div id='about-section' className='text-center w-[60%]'>
                <p className='text-xl font-semibold text-[#B00000]'>Made with <span className=''><img src={heartVector} className='inline align-baseline'/></span> and purpose</p>
                <p className='text-base text-text-gray mt-7'>Hi, I am Manish. I created this website as a personal side project for learning full stack web development using modern methodologies and considering scalability. Also creating something for the dev community gives me immense pleasure, which was also a primary motivator behind creating this project. While inspired by the well known platform Leetcode, the logic and implementation of Acecode are entirely my own.</p>
                <Link isBlock showAnchorIcon color="primary" className='mt-7 text-xl font-semibold'>Visit <span><img src={GithubLogo} className='w-14 mx-2'/></span> Repo</Link>
            </div>
        </div>
        <Footer/>
    </BackgroundWrapper>          
}

export default LandingPage