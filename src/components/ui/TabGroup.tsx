import * as React from "react"
import { cn } from "../../lib/utils"

export interface TabGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "pills" | "underline"
  size?: "sm" | "md" | "lg"
  value?: string
  onValueChange?: (value: string) => void
}

const TabGroup = React.forwardRef<HTMLDivElement, TabGroupProps>(
  ({ 
    className, 
    orientation = "horizontal",
    variant = "default",
    size = "md",
    value,
    onValueChange,
    children,
    ...props 
  }, ref) => {
    
    // 方向クラス
    const orientationClasses = {
      horizontal: 'flex space-x-1',
      vertical: 'flex flex-col space-y-1'
    };

    // 子コンポーネントにpropsを渡す
    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          variant,
          size,
          active: child.props.value === value,
          onClick: (e: React.MouseEvent) => {
            child.props.onClick?.(e);
            onValueChange?.(child.props.value);
          },
          ...child.props, // 既存のpropsを保持
        });
      }
      return child;
    });

    return (
      <div
        className={cn(
          'tab-group',
          orientationClasses[orientation],
          className
        )}
        role="tablist"
        ref={ref}
        {...props}
      >
        {childrenWithProps}
      </div>
    )
  }
)
TabGroup.displayName = "TabGroup"

export { TabGroup }