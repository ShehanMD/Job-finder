
import React from 'react';
const Input = ({label, type, placeholder, value, onChange}) => {
    
    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px'}}>
            {label && <label style={{fontSize: '14px', fontWeight: "bold"}}>{label}</label>}

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#D9D9D9',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#000',
                }}    
            />
        </div>
    )
}

export default Input;