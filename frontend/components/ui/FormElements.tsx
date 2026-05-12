import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-display font-semibold tracking-widest uppercase text-steel-200"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-300">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`
            w-full glass rounded-lg px-4 py-2.5 text-sm text-white
            placeholder:text-steel-400
            focus:outline-none focus:border-crimson-500 focus:ring-1 focus:ring-crimson-500/50
            border border-white/10 transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', id, ...props }: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-display font-semibold tracking-widest uppercase text-steel-200"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full glass rounded-lg px-4 py-2.5 text-sm text-white
          border border-white/10 focus:outline-none focus:border-crimson-500
          transition-all duration-200 cursor-pointer appearance-none
          bg-obsidian-200
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-obsidian-200">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
