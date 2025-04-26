import { FC, useState, Children } from 'react';

// import { bem } from '@/css/bem.ts';

import './OptionBlock.css';

// const [b, e] = bem('rgb');

export type OptionBlockProps = {
  className?: string;
  children: React.ReactNode;
  onChange?: (index: number) => void;
  defaultSelected?: number;
};

export const OptionBlock: FC<OptionBlockProps> = ({ 
  className, 
  children, 
  onChange, 
  defaultSelected = 0,
  ...rest 
}) => {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected);
  
  const handleOptionClick = (index: number) => {
    setSelectedIndex(index);
    onChange?.(index);
  };
  
  return (
    <div className={`option-block ${className || ''}`} {...rest}>
      {Children.map(children, (child, index) => (
        <div 
          key={index}
          onClick={() => handleOptionClick(index)}
          className={`option-block__item ${selectedIndex === index ? 'option-block__item--selected' : ''}`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
