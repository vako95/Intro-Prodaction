import { useEffect, useRef } from "react";

function useOutsideAndScrollClose(onClose) {
    const ref = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                ref.current &&
                !ref.current.contains(e.target) &&
                modalRef.current &&
                !modalRef.current.contains(e.target)
            ) {
                onClose();
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [onClose]);

    return { ref, modalRef };
}

export default useOutsideAndScrollClose;
