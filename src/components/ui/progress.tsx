import * as React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export function Progress({ value = 0, ...props }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div {...props} style={{ width: '100%', background: '#eee', borderRadius: 4, height: 8 }}>
      <div style={{ width: pct + '%', background: '#4f46e5', height: '100%', borderRadius: 4 }} />
    </div>
  );
}
export default Progress;