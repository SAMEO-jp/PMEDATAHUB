import * as React from "react"
import { cn } from "../../lib/utils"
import { FormField, FormFieldProps } from "./FormField"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<FormFieldProps, 'children'> {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  searchable?: boolean
  loading?: boolean
  disabled?: boolean
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ 
    className, 
    value, 
    onValueChange,
    placeholder = "選択してください",
    options = [],
    searchable = false,
    loading = false,
    disabled = false,
    label,
    required,
    error,
    hint,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')

    const filteredOptions = React.useMemo(() => {
      if (!searchable || !searchTerm) return options
      return options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }, [options, searchTerm, searchable])

    const selectedOption = options.find(option => option.value === value)

    return (
      <FormField
        ref={ref}
        label={label}
        required={required}
        error={error}
        hint={hint}
        className={className}
        {...props}
      >
        <div className="relative">
          <button
            type="button"
            className={cn(
              "w-full p-2 text-left border rounded bg-white",
              "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-red-300 focus:ring-red-500",
              !error && "border-gray-300"
            )}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled || loading}
          >
            {loading ? (
              <span className="text-sm text-gray-400">読み込み中...</span>
            ) : selectedOption ? (
              <span className="text-sm">{selectedOption.label}</span>
            ) : (
              <span className="text-sm text-gray-400">{placeholder}</span>
            )}
          </button>
          
          {isOpen && !disabled && !loading && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {searchable && (
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="検索..."
                    className="w-full p-2 text-sm border rounded mb-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                  />
                </div>
              )}
              
              <div className="max-h-48 overflow-auto">
                {filteredOptions.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500 text-center">
                    {searchTerm ? '検索結果がありません' : 'オプションがありません'}
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      className={cn(
                        "w-full p-2 text-left text-sm hover:bg-gray-100",
                        "focus:bg-gray-100 focus:outline-none",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        value === option.value && "bg-blue-50 text-blue-700"
                      )}
                      disabled={option.disabled}
                      onClick={() => {
                        onValueChange?.(option.value)
                        setIsOpen(false)
                        setSearchTerm('')
                      }}
                    >
                      {option.label}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </FormField>
    )
  }
)
Select.displayName = "Select"

export { Select }