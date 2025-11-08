import React from 'react';

type ButtonProps = {
  variant?: 'default' | 'outline' | 'danger' | 'secondary'; // Different button styles
  children: React.ReactNode; // The content of the button
  className?: string; // Custom class names to apply additional styling
  onClick?: React.MouseEventHandler<HTMLButtonElement>; // Click handler
  type?: 'button' | 'submit' | 'reset'; // Button type
};

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  children,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Base button styles
  const baseStyles =
    'py-2 px-4 rounded-lg font-semibold focus:outline-none transition duration-200';

  // Button style variants
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
