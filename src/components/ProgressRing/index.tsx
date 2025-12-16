import { Canvas, View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useRef, ReactNode } from 'react';
import './index.scss';

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
  children?: ReactNode;
  /** 是否显示脉冲动画 */
  pulse?: boolean;
  /** Canvas ID（确保唯一） */
  canvasId?: string;
}

/**
 * 环形进度条组件（Taro Canvas 版本）
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 240,
  strokeWidth = 12,
  color,
  backgroundColor = '#E0E0E0',
  children,
  pulse = false,
  canvasId = 'progressRing',
}) => {
  const prevProgressRef = useRef(progress);

  useEffect(() => {
    const drawRing = () => {
      // 获取系统信息以处理像素比
      const systemInfo = Taro.getSystemInfoSync();
      const pixelRatio = systemInfo.pixelRatio || 1;
      
      const ctx = Taro.createCanvasContext(canvasId);
      const radius = (size - strokeWidth) / 2;
      const centerX = size / 2;
      const centerY = size / 2;

      // 清空画布
      ctx.clearRect(0, 0, size, size);

      // 绘制背景环
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.setStrokeStyle(backgroundColor);
      ctx.setLineWidth(strokeWidth);
      ctx.setLineCap('round');
      ctx.stroke();

      // 绘制进度环
      if (progress > 0) {
        ctx.beginPath();
        const startAngle = -Math.PI / 2; // 从顶部开始
        const endAngle = startAngle + (progress / 100) * 2 * Math.PI;
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.setStrokeStyle(color);
        ctx.setLineWidth(strokeWidth);
        ctx.setLineCap('round');
        ctx.stroke();
      }

      ctx.draw();
    };

    drawRing();
    prevProgressRef.current = progress;
  }, [progress, size, strokeWidth, color, backgroundColor, canvasId]);

  // 转换为 rpx（Taro 设计稿宽度 750）
  const sizeRpx = size * 2;
  const pulseClass = pulse ? 'progress-ring-pulse' : '';

  return (
    <View 
      className={`progress-ring-container ${pulseClass}`}
      style={{ width: `${sizeRpx}rpx`, height: `${sizeRpx}rpx` }}
    >
      <Canvas
        canvasId={canvasId}
        className="progress-ring-canvas"
        style={{ width: `${sizeRpx}rpx`, height: `${sizeRpx}rpx` }}
      />
      {children && (
        <View className="progress-ring-content">
          {children}
        </View>
      )}
    </View>
  );
};

