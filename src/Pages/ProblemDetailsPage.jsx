import { useParams, useLocation } from "react-router-dom"

export default function ProblemDetailsPage(){

    const {pathname} = useLocation()

    console.log(pathname)

    const {id} = useParams()

    return (
        <div>
            <p className="text-white text-4xl font-medium">Problem Detials Page</p>
            <p className="text-white">Problem Id: {id}</p>
        </div>
    )
} 