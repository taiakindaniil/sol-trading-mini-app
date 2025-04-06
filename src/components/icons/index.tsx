import React from 'react';

export interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const IconSizes = {
  SMALL: 16,
  MEDIUM: 24,
  LARGE: 32,
};

/**
 * Base Icon component that all other icon components will extend
 */
export const Icon: React.FC<IconProps> = ({ 
  size = IconSizes.MEDIUM,
  color = 'currentColor',
  className = '',
  onClick,
  children 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{ color }}
    >
      {children}
    </svg>
  );
};

// Export icon components
export * from './TokenIcon';
export * from './WalletIcon';
export * from './ArrowUpIcon';
export * from './ArrowDownIcon';
export * from './ClipboardIcon';

// These exports are commented out until the icon components are created
// export * from './SettingsIcon';
// export * from './QRIcon';
// export * from './PlusIcon'; 