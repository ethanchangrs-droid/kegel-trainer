import { View, Text } from '@tarojs/components';
import { ReactNode } from 'react';
import './index.scss';

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
  children: ReactNode;
  /** 额外样式类 */
  className?: string;
}

/**
 * 按钮组件（Taro 版本）
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
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    disabled ? 'btn-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <View
      className={classNames}
      hoverClass={disabled ? 'none' : 'btn-hover'}
      onClick={handleClick}
    >
      <Text>{children}</Text>
    </View>
  );
};

