import { useEffect } from "react";

type NotifProp = {
    text: string,
    isOpen: boolean,
    requestCloseNotif : () => void
};

const Notif = ({ text, isOpen, requestCloseNotif } : NotifProp) => {
    useEffect(() => {
        if(isOpen){
            const timer = setTimeout(() => {
                requestCloseNotif();
            }, 1000);
    
            return () => clearTimeout(timer);
        }
    }, [isOpen])

    return (
        isOpen ? 
        <div className="absolute bottom-0 right-0 bg-white px-4 py-2 text-black">
            {text}
        </div>
        : 
        <></>
    )
}

export default Notif