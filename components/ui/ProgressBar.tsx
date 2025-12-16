import { cn } from '@/lib/utils/cn';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({
  current,
  total,
  label,
  showPercentage = true,
  showCount = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const heights = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Label and Stats */}
      {(label || showPercentage || showCount) && (
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-gray-400 font-medium">{label}</span>
          <div className="flex items-center gap-3">
            {showCount && (
              <span className="text-gray-300">
                {current} / {total}
              </span>
            )}
            {showPercentage && (
              <span className="text-white font-semibold">{percentage}%</span>
            )}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full bg-blue-600 transition-all duration-300 ease-out',
            percentage === 100 && 'bg-green-600'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  className,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-blue-600 transition-all duration-300"
        />
      </svg>
      {/* Percentage text */}
      <span className="absolute text-xl font-semibold text-gray-900">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}