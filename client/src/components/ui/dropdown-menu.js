import React from 'react';

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" onClick={toggleDropdown}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { isOpen })
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, isOpen }) => {
  return (
    <div 
      className={`cursor-pointer ${isOpen ? 'bg-gray-100' : ''}`}
    >
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ 
  children, 
  onSelect, 
  className = '',
  ...props 
}) => {
  const handleClick = (e) => {
    onSelect && onSelect(e);
  };

  return (
    <div 
      onClick={handleClick} 
      className={`w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};