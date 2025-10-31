import React from "react";


const NotFound : React.FC = () => {
    return(
        <div className="flex items-center justify-center h-screen text-white bg-secondary">
           <div className="font-[700] text-[2em] md:text-[3em] text-center grid content-center justify-items-center">
                <p className="font-[500] mb-3">Oops!!</p>
                Page Not Found
           </div>
        </div>
    );
}

export default NotFound;