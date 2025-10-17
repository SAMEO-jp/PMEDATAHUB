import * as React from "react"
import { cn } from "../../lib/utils"

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  required?: boolean
  error?: string
  hint?: string
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, label, required, error, hint, children, ...props }, ref) => {
    return (
      <div
        className={cn("space-y-2", className)}
        ref={ref}
        {...props}
      >
        {label && (
          <label className={cn(
            "block text-xs font-medium text-gray-500",
            error && "text-red-500"
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {children}
        </div>
        
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        
        {hint && !error && (
          <p className="text-xs text-gray-400">{hint}</p>
        )}
      </div>
    )
  }
)
FormField.displayName = "FormField"

export { FormField }