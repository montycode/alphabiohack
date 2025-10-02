"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BaseProps = {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

type FieldType = "input" | "textarea";

type FormFieldProps = BaseProps & {
  type?: FieldType;
  inputType?: React.ComponentProps<"input">["type"];
};

export function FormField({
  id,
  name,
  label,
  placeholder,
  required,
  className,
  value,
  onChange,
  type = "input",
  inputType = "text",
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      {type === "textarea" ? (
        <Textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={5}
          className="w-full resize-none"
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full"
        />
      )}
    </div>
  );
}


