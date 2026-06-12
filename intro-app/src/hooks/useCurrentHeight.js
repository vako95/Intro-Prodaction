import { useState, useRef, useEffect } from "react";

const useCurrentHeight = (deps) => {
    const ref = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(() => {
                return ref.current.scrollHeight;
            })
        }
    }, deps)

    return [ref, height];

}

export default useCurrentHeight;

