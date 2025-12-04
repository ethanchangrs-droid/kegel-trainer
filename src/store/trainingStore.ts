import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  TrainingSettings,
  TrainingState,
  TrainingResult,
  TrainingPlanItem,
  TrainingPhase,
} from '../types';
import { DEFAULT_SETTINGS, INITIAL_TRAINING_STATE } from '../types';
import { generateTrainingPlan, calculateTotalReps } from '../utils/calculations';

interface TrainingStore {
  // 设置
  settings: TrainingSettings;
  updateSettings: (settings: Partial<TrainingSettings>) => void;
  resetSettings: () => void;

  // 训练状态
  state: TrainingState;
  plan: TrainingPlanItem[];
  planIndex: number;
  startTime: number | null;
  completedReps: number;

  // 动作
  startTraining: () => void;
  pauseTraining: () => void;
  resumeTraining: () => void;
  stopTraining: () => void;
  tick: () => void;

  // 结果
  result: TrainingResult | null;
}

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      settings: DEFAULT_SETTINGS,
      state: INITIAL_TRAINING_STATE,
      plan: [],
      planIndex: 0,
      startTime: null,
      completedReps: 0,
      result: null,

      // 更新设置
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // 重置设置
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

      // 开始训练
      startTraining: () => {
        const { settings } = get();
        const plan = generateTrainingPlan(settings);

        set({
          plan,
          planIndex: 0,
          startTime: Date.now(),
          completedReps: 0,
          result: null,
          state: {
            phase: 'countdown',
            currentMode: 'quick',
            currentSet: 1,
            currentRep: 1,
            secondsRemaining: 3,
            totalProgress: 0,
          },
        });
      },

      // 暂停训练
      pauseTraining: () => {
        const { state } = get();
        set({
          state: {
            ...state,
            previousPhase: state.phase,
            phase: 'paused',
          },
        });
      },

      // 继续训练
      resumeTraining: () => {
        const { state } = get();
        set({
          state: {
            ...state,
            phase: state.previousPhase || 'contract',
            previousPhase: undefined,
          },
        });
      },

      // 停止训练
      stopTraining: () => {
        const { completedReps, startTime, settings, planIndex, state } = get();
        const totalReps = calculateTotalReps(settings);
        const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

        // 计算完成的组数
        let completedSets = 0;
        for (let i = 0; i < planIndex; i++) {
          completedSets++;
        }
        // 如果当前组已完成部分
        if (state.currentRep > 1 || state.phase === 'completed') {
          completedSets++;
        }

        set({
          state: { ...state, phase: 'completed' },
          result: {
            totalReps: completedReps,
            totalDuration: duration,
            completedSets,
            isCompleted: completedReps >= totalReps,
          },
        });
      },

      // 每秒 tick
      tick: () => {
        const { state, plan, planIndex, settings, completedReps } = get();
        const { phase, secondsRemaining, currentRep } = state;

        // 暂停或完成状态不处理
        if (phase === 'paused' || phase === 'completed' || phase === 'idle') {
          return;
        }

        // 还有剩余时间
        if (secondsRemaining > 1) {
          set({
            state: { ...state, secondsRemaining: secondsRemaining - 1 },
          });
          return;
        }

        // 时间耗尽，切换到下一阶段
        const currentPlan = plan[planIndex];
        const totalReps = calculateTotalReps(settings);

        switch (phase) {
          case 'countdown':
            // 倒计时结束 → 开始第一次收紧
            set({
              state: {
                ...state,
                phase: 'contract',
                currentMode: currentPlan.mode,
                currentSet: currentPlan.setNumber,
                secondsRemaining: currentPlan.contractDuration,
              },
            });
            break;

          case 'contract':
            // 收紧结束 → 进入放松
            set({
              state: {
                ...state,
                phase: 'relax',
                secondsRemaining: currentPlan.relaxDuration,
              },
            });
            break;

          case 'relax': {
            // 放松结束
            const newCompletedReps = completedReps + 1;
            const progress = Math.round((newCompletedReps / totalReps) * 100);

            if (currentRep < currentPlan.repsCount) {
              // 当前组未完成 → 下一次收紧
              set({
                completedReps: newCompletedReps,
                state: {
                  ...state,
                  phase: 'contract',
                  currentRep: currentRep + 1,
                  secondsRemaining: currentPlan.contractDuration,
                  totalProgress: progress,
                },
              });
            } else {
              // 当前组已完成
              const nextPlanIndex = planIndex + 1;

              if (nextPlanIndex >= plan.length) {
                // 所有组完成 → 训练结束
                set({
                  completedReps: newCompletedReps,
                  state: {
                    ...state,
                    phase: 'completed',
                    totalProgress: 100,
                  },
                });
                // 自动调用 stopTraining 计算结果
                get().stopTraining();
              } else {
                // 进入组间休息
                set({
                  completedReps: newCompletedReps,
                  state: {
                    ...state,
                    phase: 'rest',
                    secondsRemaining: settings.restBetweenSets,
                    totalProgress: progress,
                  },
                });
              }
            }
            break;
          }

          case 'rest': {
            // 休息结束 → 开始下一组
            const nextIndex = planIndex + 1;
            const nextPlan = plan[nextIndex];

            set({
              planIndex: nextIndex,
              state: {
                ...state,
                phase: 'contract',
                currentMode: nextPlan.mode,
                currentSet: nextPlan.setNumber,
                currentRep: 1,
                secondsRemaining: nextPlan.contractDuration,
              },
            });
            break;
          }
        }
      },
    }),
    {
      name: 'kegel-trainer-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

/** 获取当前阶段的显示文本 */
export function getPhaseText(phase: TrainingPhase): string {
  const texts: Record<TrainingPhase, string> = {
    idle: '准备',
    countdown: '准备',
    contract: '收紧',
    relax: '放松',
    rest: '休息',
    paused: '已暂停',
    completed: '完成',
  };
  return texts[phase];
}

/** 获取当前阶段的颜色 */
export function getPhaseColor(phase: TrainingPhase): string {
  const colors: Record<TrainingPhase, string> = {
    idle: '#26A69A',
    countdown: '#FFC107',
    contract: '#FF7043',
    relax: '#26A69A',
    rest: '#80CBC4',
    paused: '#757575',
    completed: '#4CAF50',
  };
  return colors[phase];
}

