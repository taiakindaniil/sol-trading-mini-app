import React from 'react';
import { Icon, IconProps } from './index';

export const TokenIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2"/>
    </Icon>
  );
}; 