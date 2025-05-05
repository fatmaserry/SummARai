import React from "react";

interface FormField {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
}

const Form = ({
  title,
  onSubmit,
  fields,
  submitLabel,
  footer,
}: {
  title?: string;
  onSubmit: (e: React.FormEvent) => void;
  fields: FormField[];
  submitLabel: string;
  footer?: React.ReactNode;
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 text-right">
      {title && (
        <h2 className="text-4xl font-bold text-primary-400 text-center mb-6">
          {title}
        </h2>
      )}

      {fields.map((field, index) => (
        <div key={index}>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={field.value}
            onChange={field.onChange}
            required={field.required}
            className="w-full border rounded-lg py-2 px-4 text-[16px] [&::placeholder]:text-[16px] focus:text-[16px] focus:outline-none focus:ring-2 focus:ring-primary-400 text-right"
          />
        </div>
      ))}

      {footer}

      <button
        type="submit"
        className="w-full bg-primary-400 hover:bg-primary-500 text-white text-base font-medium py-2 px-4 rounded-lg transition"
      >
        {submitLabel}
      </button>
    </form>
  );
};

export default Form;
