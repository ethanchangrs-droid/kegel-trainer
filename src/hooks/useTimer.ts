import { useEffect, useRef } from 'react';

/**
 * 计时器 Hook（Taro 兼容版本）
 * @param isRunning 是否运行
 * @param onTick 每秒回调
 * @param interval 间隔毫秒数
 */
export function useTimer(
  isRunning: boolean,
  onTick: () => void,
  interval: number = 1000
) {
  const tickRef = useRef(onTick);
  const lastTickRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 保持 onTick 最新
  useEffect(() => {
    tickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!isRunning) {
      lastTickRef.current = 0;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // 初始化时间戳
    lastTickRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;

      // 补偿机制：如果超过间隔时间才触发
      if (elapsed >= interval) {
        tickRef.current();
        lastTickRef.current = now;
      }
    }, 100); // 更高频率检查，提高精度

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, interval]);
}

