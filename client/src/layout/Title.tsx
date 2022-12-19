import React from 'react';

interface TitleProps {
  size?: string;
}

function Title({
  children,
  size = 'text-2xl md:text-3xl lg:text-4xl',
}: React.PropsWithChildren<TitleProps>) {
  return (
    <div className="w-full">
      <h1
        className={`mb-4 ${size} font-extrabold tracking-tight leading-none text-gray-900 dark:text-white`}
      >
        {children}
      </h1>
    </div>
  );
}

export default Title;
