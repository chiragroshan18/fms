import React from 'react';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  icon: Icon,
  placeholder = 'Select an option',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none z-10">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <select
          ref={ref}
          className={`glass-input w-full rounded-xl py-2.5 text-sm appearance-none cursor-pointer ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-10 ${error ? 'border-rose-500/60' : ''} ${className}`}
          {...props}
        >
          {placeholder && <option value="" className="bg-slate-900 text-slate-400">{placeholder}</option>}
          {options.map((opt) => (
            <option
              key={typeof opt === 'string' ? opt : opt.value}
              value={typeof opt === 'string' ? opt : opt.value}
              className="bg-slate-900 text-slate-100 py-2"
            >
              {typeof opt === 'string' ? opt : opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 text-slate-400 pointer-events-none">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {error && (
        <span className="text-xs text-rose-400 font-medium mt-0.5 animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
