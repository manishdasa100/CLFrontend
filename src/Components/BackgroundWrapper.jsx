import { NextUIProvider } from "@nextui-org/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BackgroundWrapper = ({children}) => {

    // const navigate = useNavigate()

    return (
        <div className='min-h-screen bg-app-background-color flex flex-col items-center'>
            {children}
        </div>
    )
}

export default BackgroundWrapper;