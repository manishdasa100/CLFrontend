import {useState} from 'react'
import BackgroundWrapper from "../Components/BackgroundWrapper"
import Logo from '../assets/Logo.svg'
import EyeOpenIcon from '../assets/eyeOpenIcon.svg' 
import EyeSlashIcon from '../assets/eyeSlashIcon.svg' 
import {Input} from "@nextui-org/react"
import {Button} from "@nextui-org/button"
import {Link} from "@nextui-org/react";

const SignUpPage = () =>{

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = (k) => {
        (k==1)?setIsPasswordVisible(!isPasswordVisible):setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
    }

    return <BackgroundWrapper>
        <div className="h-screen flex justify-center items-center">
            <div className="w-1/3 px-10 py-8 rounded-xl text-center flex flex-col items-center bg-[#535353]/10 shadow-xl text-text-gray">
                <img src={Logo} className='flex-initial mb-10' alt='Logo'></img>
                <Input variant="bordered" label="Username" labelPlacement="inside" color='#00e89b' classNames={{
                    inputWrapper: [
                        "shadow-xl",
                        "border-stroke-gray/30",
                        "group-data-[focus=true]:border-stroke-gray",
                        "mb-4"
                    ],}}
                />
                <div className="w-full flex mb-4 gap-4">
                    <Input variant="bordered" label="First name" labelPlacement="inside" classNames={{
                        inputWrapper: [
                            "shadow-xl",
                            "border-stroke-gray/30",
                            "group-data-[focus=true]:border-stroke-gray",
                        ],}}
                    />
                    <Input variant="bordered" label="Last name" labelPlacement="inside" classNames={{
                        inputWrapper: [
                            "shadow-xl",
                            "border-stroke-gray/30",
                            "group-data-[focus=true]:border-stroke-gray",
                        ],}}
                    />
                </div>
                <Input type="email" variant="bordered" label="Email" labelPlacement="inside" classNames={{
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
                <Input 
                    label="Confirm password"
                    labelPlacement='inside'
                    variant="bordered"
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={()=>{togglePasswordVisibility(2)}} aria-label="toggle password visibility">
                        {isConfirmPasswordVisible ? (
                          <img src={EyeSlashIcon}/>
                        ) : (
                          <img src={EyeOpenIcon}/>
                        )}
                      </button>
                    }
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    classNames={{
                        inputWrapper: [
                            "shadow-xl",
                            "border-stroke-gray/30",
                            "group-data-[focus=true]:border-stroke-gray",
                            "mb-4"
                        ],
                    }}
                />
                <Button color="primary" variant='solid' size='lg' className='w-full shadow-2xl mb-4'>Create Account</Button>
                <p className='text-sm'>Have an account? <Link href='#'size='sm' >Sign In</Link></p>
            </div>
        </div>
    </BackgroundWrapper>
}

export default SignUpPage