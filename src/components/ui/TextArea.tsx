import * as React from "react"
import { cn } from "../../lib/utils"
import { FormField, FormFieldProps } from "./FormField"

export interface TextAreaProps 
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>,
    Omit<FormFieldProps, 'children'> {
  resize?: boolean
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ 
    className,
    resize = true,
    label,
    required,
    error,
    hint,
    ...props 
  }, ref) => {
    return (
      <FormField
        label={label}
        required={required}
        error={error}
        hint={hint}
        className={className}
      >
        <textarea
          className={cn(
            "w-full p-2 border border-gray-300 rounded",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "placeholder:text-gray-400",
            !resize && "resize-none",
            error && "border-red-300 focus:ring-red-500"
          )}
          ref={ref}
          {...props}
        />
      </FormField>
    )
  }
)
TextArea.displayName = "TextArea"

export { TextArea }