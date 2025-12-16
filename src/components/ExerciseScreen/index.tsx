import { View, Text } from '@tarojs/components';
import { ProgressRing } from '../ProgressRing';
import { Button } from '../Button';
import type { TrainingState, TrainingSettings, TrainingPlanItem } from '../../types';
import { getPhaseText, getPhaseColor } from '../../store/trainingStore';
import './index.scss';

interface ExerciseScreenProps {
  state: TrainingState;
  settings: TrainingSettings;
  currentPlan: TrainingPlanItem;
  totalSets: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

/**
 * 运动画面（Taro 版本）
 */
export const ExerciseScreen: React.FC<ExerciseScreenProps> = ({
  state,
  settings,
  currentPlan,
  totalSets,
  onPause,
  onResume,
  onStop,
}) => {
  const { phase, currentMode, currentSet, currentRep, secondsRemaining, totalProgress } = state;
  const isPaused = phase === 'paused';
  const isResting = phase === 'rest';

  // 计算当前阶段进度
  const getPhaseDuration = () => {
    if (isResting) return settings.restBetweenSets;
    if (phase === 'contract') return currentPlan.contractDuration;
    if (phase === 'relax') return currentPlan.relaxDuration;
    return 1;
  };

  const phaseDuration = getPhaseDuration();
  const phaseProgress = ((phaseDuration - secondsRemaining) / phaseDuration) * 100;

  const phaseColor = getPhaseColor(phase);
  const phaseText = getPhaseText(phase);
  const modeText = currentMode === 'quick' ? '收放自如' : '坚持一下';

  // 计算当前是总共第几组
  const currentTotalSet = currentMode === 'quick'
    ? currentSet
    : settings.quickSets + currentSet;

  return (
    <View className="exercise-screen animate-fade-in">
      {/* 组信息 */}
      <View className="exercise-info">
        <Text className="exercise-mode">
          第{currentTotalSet}组 · {modeText}模式
        </Text>
        <Text className="exercise-progress-text">
          {currentTotalSet}/{totalSets}组
        </Text>
      </View>

      {/* 环形进度 */}
      <View className="exercise-ring">
        <ProgressRing
          progress={isPaused ? 0 : phaseProgress}
          color={phaseColor}
          size={260}
          strokeWidth={14}
          canvasId="exerciseRing"
        >
          <View className="exercise-ring-content">
            {isPaused ? (
              <>
                <Text className="exercise-paused-icon">⏸️</Text>
                <Text className="exercise-paused-text">已暂停</Text>
              </>
            ) : (
              <>
                <Text 
                  className="exercise-phase-text"
                  style={{ color: phaseColor }}
                >
                  {phaseText}
                </Text>
                <Text className="exercise-seconds">{secondsRemaining}秒</Text>
              </>
            )}
          </View>
        </ProgressRing>
      </View>

      {/* 次数进度 */}
      {!isResting && !isPaused && (
        <View className="exercise-reps">
          <Text className="exercise-reps-text">
            第 <Text className="exercise-reps-current">{currentRep}</Text> / {currentPlan.repsCount} 次
          </Text>
        </View>
      )}

      {isResting && !isPaused && (
        <View className="exercise-rest-hint">
          <Text>组间休息中，准备下一组</Text>
        </View>
      )}

      {/* 总进度条 */}
      <View className="exercise-total-progress">
        <View className="exercise-progress-bar">
          <View 
            className="exercise-progress-fill"
            style={{ width: `${totalProgress}%` }}
          />
        </View>
        <Text className="exercise-progress-label">总进度 {totalProgress}%</Text>
      </View>

      {/* 控制按钮 */}
      <View className="exercise-controls">
        <Button
          variant="secondary"
          onClick={isPaused ? onResume : onPause}
        >
          {isPaused ? '继续' : '暂停'}
        </Button>
        <Button
          variant="text"
          onClick={onStop}
        >
          结束训练
        </Button>
      </View>
    </View>
  );
};

