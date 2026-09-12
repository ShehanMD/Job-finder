import React from "react";

export const Button = ({ children, onClick, variant = 'primary', className = ''}) => {
    const baseClasses = 'h-12 px-4 py-2 rounded-xl font-bold transition duration-300';
    let variantClasses = '';

    if (variant === 'primary') {
        variantClasses = "bg-[#00c49f] hover:bg-[#00a887] text-white";
    } else if (variant === 'red') {
        variantClasses = "bg-red-500 hover:bg-red-600 text-white";
    } else if (variant === 'yellow') {
        variantClasses = "bg-yellow-500 hover:bg-yellow-600 text-black";
    }

    return (
        <button
           onClick={onClick}
           className={`${baseClasses} ${variantClasses} ${className}`}
        >
            {children}
        </button>
    );
}

export default Button;