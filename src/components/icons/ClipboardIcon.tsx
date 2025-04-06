import React from 'react';
import { Icon, IconProps } from './index';

export const ClipboardIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
        <path
            d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.41421C20 6.88378 19.7893 6.37507 19.4142 6L16 2.58579C15.6249 2.21071 15.1162 2 14.5858 2H10C8.89543 2 8 2.89543 8 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M16 6V8C16 9.10457 16.8954 10 18 10H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V8C4 6.89543 4.89543 6 6 6H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </Icon>
  )
}