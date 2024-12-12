'use client';

const Input = ({
                 type = 'text',
                 placeholder,
                 value,
                 onChange,
                 className = '',
                 required = false,
                 ...props
               }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${className}`}
      {...props}
    />
  );
};

export default Input;
