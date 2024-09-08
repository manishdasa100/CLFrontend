import { useState, useEffect, useRef } from "react";

export default function useDebounce(value, delay) {
    
    const [debouncedValue, setDebouncedValue] = useState('');
    // const debouceRef = useRef(value);
    
    useEffect(() => {
        let timeoutNum = setTimeout(() => {
            setDebouncedValue(value)
            // debouceRef.current = value
        }, delay)

        return () => {
            clearTimeout(timeoutNum)   
        }
    }, [value, delay])

    // return debouceRef.current
    return debouncedValue;
}