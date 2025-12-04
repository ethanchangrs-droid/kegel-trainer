import { motion } from 'framer-motion';

interface ProgressRingProps {
  /** 进度值 (0-100) */
  progress: number;
  /** 尺寸 (px) */
  size?: number;
  /** 环宽度 (px) */
  strokeWidth?: number;
  /** 进度环颜色 */
  color: string;
  /** 背景环颜色 */
  backgroundColor?: string;
  /** 中心内容 */
  children?: React.ReactNode;
  /** 是否显示脉冲动画 */
  pulse?: boolean;
}

/**
 * 环形进度条组件
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 240,
  strokeWidth = 12,
  color,
  backgroundColor = '#E0E0E0',
  children,
  pulse = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* SVG 进度环 */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* 背景环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* 进度环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </svg>

      {/* 中心内容 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={pulse ? { scale: [1, 1.05, 1] } : {}}
        transition={pulse ? { duration: 1, repeat: Infinity } : {}}
      >
        {children}
      </motion.div>
    </div>
  );
};

