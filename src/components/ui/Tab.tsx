import * as React from "react"
import { cn } from "../../lib/utils"

export interface TabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "pills" | "underline"
  size?: "sm" | "md" | "lg"
  active?: boolean
  badge?: string | number
  icon?: React.ReactNode
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ 
    className, 
    variant = "default", 
    size = "md", 
    active = false,
    badge,
    icon,
    children,
    ...props 
  }, ref) => {
    
    // サイズクラス
    const sizeClasses = {
      sm: 'text-sm px-2 py-1',
      md: 'text-base px-3 py-2',
      lg: 'text-lg px-4 py-3'
    };

    // バリアントクラス
    const variantClasses = {
      default: {
        base: 'border-b-2 border-transparent hover:border-gray-300 transition-colors',
        active: 'border-blue-500 text-blue-600 font-medium',
        inactive: 'text-gray-600 hover:text-gray-900'
      },
      pills: {
        base: 'rounded-md border border-gray-200 hover:bg-gray-50 transition-colors',
        active: 'bg-blue-500 text-white border-blue-500',
        inactive: 'text-gray-700 hover:bg-gray-100'
      },
      underline: {
        base: 'border-b-2 border-transparent hover:border-gray-300 transition-colors',
        active: 'border-blue-500 text-blue-600',
        inactive: 'text-gray-600 hover:text-gray-900'
      }
    };

    const currentVariant = variantClasses[variant];
    const currentSize = sizeClasses[size];

    return (
      <button
        className={cn(
          'flex items-center gap-2',
          'font-medium',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          currentSize,
          currentVariant.base,
          active ? currentVariant.active : currentVariant.inactive,
          className
        )}
        ref={ref}
        {...props}
      >
        {/* アイコン */}
        {icon && (
          <span className="tab-icon">
            {icon}
          </span>
        )}

        {/* ラベル */}
        <span className="tab-label">
          {children}
        </span>

        {/* バッジ */}
        {badge && (
          <span className={cn(
            'inline-flex items-center justify-center',
            'px-2 py-0.5 text-xs font-medium',
            'rounded-full',
            active 
              ? 'bg-white/20 text-white' 
              : 'bg-gray-100 text-gray-600'
          )}>
            {badge}
          </span>
        )}
      </button>
    )
  }
)
Tab.displayName = "Tab"

export { Tab }