'use client';

const Textarea = ({
                    placeholder,
                    value,
                    onChange,
                    rows = 3,
                    className = '',
                    required = false,
                    ...props
                  }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className={`w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none ${className}`}
      {...props}
    />
  );
};

export default Textarea;
