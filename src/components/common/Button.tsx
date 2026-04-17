import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  ...props 
}) => {
  const btnClass = `${styles.button} ${styles[variant]} ${size === 'lg' ? styles.btnLg : ''} ${className}`;
  
  return (
    <button className={btnClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
