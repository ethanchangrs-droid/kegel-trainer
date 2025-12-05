import { useEffect, useRef, useCallback } from 'react';

/**
 * 计时器 Hook
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

  // 保持 onTick 最新
  useEffect(() => {
    tickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    if (!isRunning) {
      lastTickRef.current = 0;
      return;
    }

    // 初始化时间戳
    lastTickRef.current = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;

      // 补偿机制：如果超过间隔时间才触发
      if (elapsed >= interval) {
        tickRef.current();
        lastTickRef.current = now;
      }
    }, 100); // 更高频率检查，提高精度

    return () => clearInterval(timer);
  }, [isRunning, interval]);
}

/**
 * 使用 requestAnimationFrame 的高精度计时器
 */
export function usePreciseTimer(
  isRunning: boolean,
  onTick: () => void,
  interval: number = 1000
) {
  const tickRef = useRef(onTick);
  const lastTickRef = useRef<number>(0);
  const rafRef = useRef<number>();

  useEffect(() => {
    tickRef.current = onTick;
  }, [onTick]);

  const tick = useCallback((timestamp: number) => {
    if (lastTickRef.current === 0) {
      lastTickRef.current = timestamp;
    }

    const elapsed = timestamp - lastTickRef.current;

    if (elapsed >= interval) {
      tickRef.current();
      lastTickRef.current = timestamp;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [interval]);

  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lastTickRef.current = 0;
      return;
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isRunning, tick]);
}




