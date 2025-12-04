/**
 * 提肛助手 - 类型定义
 */

/** 运动模式 */
export type ExerciseMode = 'quick' | 'sustained';

/** 训练阶段 */
export type TrainingPhase =
  | 'idle'        // 空闲，等待开始
  | 'countdown'   // 开始前倒计时
  | 'contract'    // 收紧中
  | 'relax'       // 放松中
  | 'rest'        // 组间休息
  | 'paused'      // 已暂停
  | 'completed';  // 训练完成

/** 训练设置 */
export interface TrainingSettings {
  // 不持续模式设置
  quickSets: number;           // 组数 (1-5)
  quickRepsPerSet: number;     // 每组次数 (5-30)
  quickContractDuration: number; // 收紧时长，固定1秒

  // 持续模式设置
  sustainedSets: number;       // 组数 (1-5)
  sustainedRepsPerSet: number; // 每组次数 (5-30)
  sustainedContractDuration: number; // 收紧时长 (3-15秒)

  // 通用设置
  relaxDuration: number;       // 放松时长 (3-10秒)
  restBetweenSets: number;     // 组间休息 (10-30秒)
}

/** 默认设置 */
export const DEFAULT_SETTINGS: TrainingSettings = {
  quickSets: 2,
  quickRepsPerSet: 20,
  quickContractDuration: 1,
  sustainedSets: 1,
  sustainedRepsPerSet: 20,
  sustainedContractDuration: 10,
  relaxDuration: 5,
  restBetweenSets: 20,
};

/** 当前训练状态 */
export interface TrainingState {
  phase: TrainingPhase;        // 当前阶段
  currentMode: ExerciseMode;   // 当前模式
  currentSet: number;          // 当前组 (从1开始)
  currentRep: number;          // 当前次 (从1开始)
  secondsRemaining: number;    // 当前阶段剩余秒数
  totalProgress: number;       // 总进度 (0-100)
  previousPhase?: TrainingPhase; // 暂停前的阶段
}

/** 初始训练状态 */
export const INITIAL_TRAINING_STATE: TrainingState = {
  phase: 'idle',
  currentMode: 'quick',
  currentSet: 1,
  currentRep: 1,
  secondsRemaining: 0,
  totalProgress: 0,
};

/** 训练结果统计 */
export interface TrainingResult {
  totalReps: number;           // 总次数
  totalDuration: number;       // 总时长（秒）
  completedSets: number;       // 完成组数
  isCompleted: boolean;        // 是否完整完成
}

/** 训练计划项 */
export interface TrainingPlanItem {
  mode: ExerciseMode;          // 模式
  setNumber: number;           // 第几组
  repsCount: number;           // 次数
  contractDuration: number;    // 收紧时长
  relaxDuration: number;       // 放松时长
}

/** 设置参数范围 */
export const SETTINGS_RANGE = {
  quickSets: { min: 0, max: 5 },
  quickRepsPerSet: { min: 5, max: 30 },
  sustainedSets: { min: 0, max: 5 },
  sustainedRepsPerSet: { min: 5, max: 30 },
  sustainedContractDuration: { min: 3, max: 15 },
  relaxDuration: { min: 3, max: 10 },
  restBetweenSets: { min: 10, max: 30 },
} as const;

