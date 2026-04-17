'use client';

import React, { useState } from 'react';
import styles from './Input.module.css';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, type, className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const containerClass = `${styles.container} ${error ? styles.error : ''} ${className}`;
  
  const toggleVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className={containerClass}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <input 
          className={styles.input} 
          type={isPasswordField && showPassword ? 'text' : type} 
          {...props} 
        />
        {isPasswordField && (
          <button 
            type="button"
            className={styles.toggleBtn}
            onClick={toggleVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
