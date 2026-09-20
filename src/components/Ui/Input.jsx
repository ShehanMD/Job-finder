import React from 'react';

const Input = ({label, type = "text", placeholder, value, onChange, ...props}) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px'}}>
            {label && <label style={{fontSize: '12px', fontWeight: "bold", color: "#D1D5DB"}}>{label}</label>}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{
                    padding: '8px 16px', // Slightly smaller padding to match your original form
                    borderRadius: '10px', // Adjusted to match standard tailwind rounding
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    outline: 'none',
                    fontSize: '14px',
                    color: '#000',
                }}
                {...props}
            />
        </div>
    )
}

export default Input;