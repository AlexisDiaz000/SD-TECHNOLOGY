
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          'flex h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
});
Select.displayName = 'Select';

export { Select };
