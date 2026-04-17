import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  const containerClass = `${styles.container} ${error ? styles.error : ''} ${className}`;
  
  return (
    <div className={containerClass}>
      {label && <label className={styles.label}>{label}</label>}
      <input className={styles.input} {...props} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

export default Input;
