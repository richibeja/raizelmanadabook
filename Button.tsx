import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant, ...props }: ButtonProps) => {
  const baseStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const primaryStyle = {
    backgroundColor: '#0070f3',
    color: 'white',
  };

  const secondaryStyle = {
    backgroundColor: '#f0f0f0',
    color: 'black',
  };

  const style = {
    ...baseStyle,
    ...(variant === 'primary' ? primaryStyle : {}),
    ...(variant === 'secondary' ? secondaryStyle : {}),
  };

  return <button style={style} {...props} />;
};