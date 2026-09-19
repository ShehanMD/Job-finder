import React from "react";

export const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'h-12 px-4 py-3 rounded-xl font-bold transition duration-300 flex items-center justify-center';
    let variantClasses = '';

    if (variant === 'primary') {
        variantClasses = "bg-[#00c49f] hover:bg-[#00a887] text-white";
    } else if (variant === 'red') {
        variantClasses = "bg-red-500 hover:bg-red-600 text-white";
    } else if (variant === 'gray') {
        variantClasses = "bg-gray-600 hover:bg-gray-700 text-white";
    } else if (variant === 'yellow') {
        variantClasses = "bg-yellow-500 hover:bg-yellow-600 text-black";
    } else if (variant === 'white') {
        variantClasses = "bg-white hover:bg-gray-100 text-black"; 
    }


    return (
        <button
           onClick={onClick}
           className={`${baseClasses} ${variantClasses} ${className}`}
           {...props}
        >
            {children}
        </button>
    );
}

export default Button;