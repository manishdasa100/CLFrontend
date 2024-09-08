import {useState} from 'react'
import BackgroundWrapper from "../Components/BackgroundWrapper"
import Logo from '../assets/Logo.svg'
import EyeOpenIcon from '../assets/eyeOpenIcon.svg' 
import EyeSlashIcon from '../assets/eyeSlashIcon.svg' 
import {Input} from "@nextui-org/react"
import {Button} from "@nextui-org/button"
import {Link} from "@nextui-org/react";

const LoginPage = () =>{

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible)   

    return <BackgroundWrapper>
        <div className="my-auto w-[507px] px-10 py-8 rounded-xl text-center flex flex-col items-center bg-[#535353]/10 shadow-xl text-text-gray">
            <img src={Logo} className='flex-initial mb-10' alt='Logo'></img>
            <Input variant="bordered" label="Username" labelPlacement="inside" color='#00e89b' classNames={{
                inputWrapper: [
                    "shadow-xl",
                    "border-stroke-gray/30",
                    "group-data-[focus=true]:border-stroke-gray",
                    "mb-4"
                ],}}
            />
            <Input 
                label="Password"
                labelPlacement='inside'
                variant="bordered"
                endContent={
                    <button className="focus:outline-none" type="button" onClick={()=>{togglePasswordVisibility(1)}} aria-label="toggle password visibility">
                    {isPasswordVisible ? (
                        <img src={EyeSlashIcon}/>
                    ) : (
                        <img src={EyeOpenIcon}/>
                    )}
                    </button>
                }
                type={isPasswordVisible ? "text" : "password"}
                classNames={{
                    inputWrapper: [
                        "shadow-xl",
                        "border-stroke-gray/30",
                        "group-data-[focus=true]:border-stroke-gray",
                        "mb-4"
                    ],
                }}
            />
            <div className='w-full flex justify-end mb-4'>
                <Link href='#'size='sm' className="text-text-gray" >Forgot password?</Link>
            </div>
            <Button color="primary" variant='solid' size='lg' className='w-full shadow-2xl mb-4'>Sign In</Button>
            <p className='text-sm'>Don't have an account? <Link href='/signup'size='sm' >Sign Up</Link></p>
        </div>
    </BackgroundWrapper>
}

export default LoginPage