import React from 'react';
import { Icon, IconProps } from './index';

export const ArrowUpIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path 
        d="M12 20L12 8M12 8L16 12M12 8L8 12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M4 4L20 4" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Icon>
  );
}; 