import React from 'react';
import { Icon, IconProps } from './index';

export const ArrowDownIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path 
        d="M12 4L12 16M12 16L16 12M12 16L8 12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M4 20L20 20" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Icon>
  );
}; 