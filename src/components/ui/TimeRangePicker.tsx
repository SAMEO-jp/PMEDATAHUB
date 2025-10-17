import * as React from "react"
import { cn } from "../../lib/utils"
import { FormField, FormFieldProps } from "./FormField"

export interface TimeRangePickerProps extends Omit<FormFieldProps, 'children'> {
  startTime?: string
  endTime?: string
  onStartTimeChange?: (time: string) => void
  onEndTimeChange?: (time: string) => void
  disabled?: boolean
  timeStep?: number // 分単位のステップ (default: 30)
}

const TimeRangePicker = React.forwardRef<HTMLDivElement, TimeRangePickerProps>(
  ({ 
    className,
    startTime,
    endTime,
    onStartTimeChange,
    onEndTimeChange,
    disabled = false,
    timeStep = 30,
    label,
    required,
    error,
    hint,
    ...props 
  }, ref) => {
    
    // 時間オプションを生成 (00:00 - 23:59)
    const generateTimeOptions = React.useMemo(() => {
      const options = []
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += timeStep) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          options.push(timeString)
        }
      }
      return options
    }, [timeStep])

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
        <div className="flex items-center space-x-2">
          {/* 開始時刻 */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">開始時間</label>
            <select
              value={startTime || ''}
              onChange={(e) => onStartTimeChange?.(e.target.value)}
              disabled={disabled}
              className={cn(
                "w-full p-2 border border-gray-300 rounded bg-white",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                error && "border-red-300 focus:ring-red-500"
              )}
            >
              <option value="">--</option>
              {generateTimeOptions.map((time) => (
                <option key={`start-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* 区切り */}
          <div className="text-gray-400 mt-6">〜</div>

          {/* 終了時刻 */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">終了時間</label>
            <select
              value={endTime || ''}
              onChange={(e) => onEndTimeChange?.(e.target.value)}
              disabled={disabled}
              className={cn(
                "w-full p-2 border border-gray-300 rounded bg-white",
                "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                error && "border-red-300 focus:ring-red-500"
              )}
            >
              <option value="">--</option>
              {generateTimeOptions.map((time) => (
                <option key={`end-${time}`} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </FormField>
    )
  }
)
TimeRangePicker.displayName = "TimeRangePicker"

export { TimeRangePicker }