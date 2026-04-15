import React from 'react';

type FormInputProps = {
  label: string;
  type?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  wrapperClassName?: string;
  inputClassName?: string;
};

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required,
  step,
  min,
  max,
  wrapperClassName = '',
  inputClassName = '',
}) => (
  <div className={`mb-7 text-left ${wrapperClassName}`}>
    <label className="mb-3 block text-base font-semibold text-slate-100">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      step={step}
      min={min}
      max={max}
      className={`w-full rounded-2xl border border-cyan-400/20 bg-slate-900/70 px-5 py-4 text-base text-white placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-cyan-300/40 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30 ${inputClassName}`}
    />
  </div>
);
