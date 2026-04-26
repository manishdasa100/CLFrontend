import { Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import { Link } from "@nextui-org/react";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import AppNavbar from "../Components/AppNavbar";

export default function ErrorPage() {
    return <BackgroundWrapper>
        <AppNavbar/>
        <div className="mt-20 text-center">
            <h1 className="text-6xl font-bold text-ivory-blue/50 mb-2">404</h1>
            <h1 className="text-2xl font-medium text-text-gray">Page not found</h1>
            <p className="text-text-gray font-thin">Sorry, but we can't find the page you are looking for.</p>
        </div>
    </BackgroundWrapper>
        
}