import * as React from "react"
import { cn } from "../../lib/utils"

// ========================================
// Sidebar Container
// ========================================
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: 'sm' | 'md' | 'lg' | 'xl'
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, width = 'md', children, ...props }, ref) => {
    const widthClasses = {
      sm: 'w-64',   // 256px
      md: 'w-80',   // 320px
      lg: 'w-96',   // 384px
      xl: 'w-[480px]' // 480px
    }

    return (
      <div
        className={cn(
          "bg-white rounded-lg shadow flex flex-col overflow-hidden",
          widthClasses[width],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

// ========================================
// Sidebar Header
// ========================================
export interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  actions?: React.ReactNode
}

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, title, actions, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "p-3 flex justify-between items-center border-b bg-white",
          className
        )}
        ref={ref}
        {...props}
      >
        {title && (
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        )}
        {children}
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    )
  }
)
SidebarHeader.displayName = "SidebarHeader"

// ========================================
// Sidebar Content
// ========================================
export interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean
}

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, scrollable = true, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex-1 p-4",
          scrollable && "overflow-y-auto",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarContent.displayName = "SidebarContent"

// ========================================
// Sidebar Section
// ========================================
export interface SidebarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  collapsible?: boolean
  defaultCollapsed?: boolean
}

const SidebarSection = React.forwardRef<HTMLDivElement, SidebarSectionProps>(
  ({ 
    className, 
    title, 
    collapsible = false,
    defaultCollapsed = false,
    children, 
    ...props 
  }, ref) => {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)

    return (
      <div
        className={cn("space-y-4", className)}
        ref={ref}
        {...props}
      >
        {title && (
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            {collapsible && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-400 hover:text-gray-600"
              >
                {isCollapsed ? '▶' : '▼'}
              </button>
            )}
          </div>
        )}
        
        {(!collapsible || !isCollapsed) && (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </div>
    )
  }
)
SidebarSection.displayName = "SidebarSection"

// ========================================
// Sidebar Actions
// ========================================
export interface SidebarActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between'
}

const SidebarActions = React.forwardRef<HTMLDivElement, SidebarActionsProps>(
  ({ className, align = 'between', children, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center', 
      right: 'justify-end',
      between: 'justify-between'
    }

    return (
      <div
        className={cn(
          "p-4 border-t bg-gray-50 flex items-center space-x-2",
          alignClasses[align],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SidebarActions.displayName = "SidebarActions"

export { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarSection, 
  SidebarActions 
}