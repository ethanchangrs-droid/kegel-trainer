/**
 * 提肛助手 - 计算工具函数
 */

import type { TrainingSettings, TrainingPlanItem } from '../types';

/**
 * 生成训练计划队列
 * @param settings 训练设置
 * @returns 训练计划项数组
 */
export function generateTrainingPlan(settings: TrainingSettings): TrainingPlanItem[] {
  const plan: TrainingPlanItem[] = [];

  // 添加不持续模式的组
  for (let i = 1; i <= settings.quickSets; i++) {
    plan.push({
      mode: 'quick',
      setNumber: i,
      repsCount: settings.quickRepsPerSet,
      contractDuration: settings.quickContractDuration,
      relaxDuration: settings.relaxDuration,
    });
  }

  // 添加持续模式的组
  for (let i = 1; i <= settings.sustainedSets; i++) {
    plan.push({
      mode: 'sustained',
      setNumber: i,
      repsCount: settings.sustainedRepsPerSet,
      contractDuration: settings.sustainedContractDuration,
      relaxDuration: settings.relaxDuration,
    });
  }

  return plan;
}

/**
 * 计算总训练时长（秒）
 * @param settings 训练设置
 * @returns 总时长（秒）
 */
export function calculateTotalDuration(settings: TrainingSettings): number {
  const countdownTime = 3;

  // 不持续模式时长
  const quickTime =
    settings.quickSets *
    settings.quickRepsPerSet *
    (settings.quickContractDuration + settings.relaxDuration);

  // 持续模式时长
  const sustainedTime =
    settings.sustainedSets *
    settings.sustainedRepsPerSet *
    (settings.sustainedContractDuration + settings.relaxDuration);

  // 组间休息时长 (总组数 - 1)
  const totalSets = settings.quickSets + settings.sustainedSets;
  const restTime = (totalSets - 1) * settings.restBetweenSets;

  return countdownTime + quickTime + sustainedTime + restTime;
}

/**
 * 计算总次数
 * @param settings 训练设置
 * @returns 总次数
 */
export function calculateTotalReps(settings: TrainingSettings): number {
  return (
    settings.quickSets * settings.quickRepsPerSet +
    settings.sustainedSets * settings.sustainedRepsPerSet
  );
}

/**
 * 计算当前进度百分比
 * @param completedReps 已完成次数
 * @param settings 训练设置
 * @returns 进度百分比 (0-100)
 */
export function calculateProgress(
  completedReps: number,
  settings: TrainingSettings
): number {
  const totalReps = calculateTotalReps(settings);
  if (totalReps === 0) return 0;
  return Math.round((completedReps / totalReps) * 100);
}

/**
 * 格式化时长显示
 * @param seconds 秒数
 * @returns 格式化字符串 (如 "10:23")
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化时长为中文显示
 * @param seconds 秒数
 * @returns 格式化字符串 (如 "10分23秒")
 */
export function formatDurationChinese(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) {
    return `${secs}秒`;
  }
  if (secs === 0) {
    return `${mins}分钟`;
  }
  return `${mins}分${secs}秒`;
}

/**
 * 获取总组数
 * @param settings 训练设置
 * @returns 总组数
 */
export function getTotalSets(settings: TrainingSettings): number {
  return settings.quickSets + settings.sustainedSets;
}

