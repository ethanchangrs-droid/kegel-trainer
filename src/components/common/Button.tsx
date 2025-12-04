import { motion } from 'framer-motion';

interface ButtonProps {
  /** 按钮类型 */
  variant?: 'primary' | 'secondary' | 'text';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否全宽 */
  fullWidth?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 子元素 */
  children: React.ReactNode;
  /** 额外样式类 */
  className?: string;
}

/**
 * 按钮组件
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  className = '',
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-colors duration-150 select-none';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300',
    secondary: 'border-2 border-primary text-primary hover:bg-primary/5 disabled:border-gray-300 disabled:text-gray-300',
    text: 'text-gray-500 hover:text-gray-700 disabled:text-gray-300',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.button>
  );
};

