import { useState } from "react";
import HeartSolid from "../assets/HeartSolid";
import HeartOutline from "../assets/HeartOutline";

export default function Like() {

    const [liked, setLiked] = useState(false);
    
    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <div className="flex flex-col gap-1 items-center">
            {liked ? (
                <HeartSolid color="#B00000" className="size-5 cursor-pointer" onClick={toggleLike} />
            ) : (
                <HeartOutline className="size-5 cursor-pointer" onClick={toggleLike} />
            )}
            <span className="text-xs text-text-gray">15.3k</span>
        </div>
    );
}