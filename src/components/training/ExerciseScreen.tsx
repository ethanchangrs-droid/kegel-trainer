import { motion } from 'framer-motion';
import { ProgressRing } from '../common/ProgressRing';
import { Button } from '../common/Button';
import type { TrainingState, TrainingSettings, TrainingPlanItem } from '../../types';
import { getPhaseText, getPhaseColor } from '../../store/trainingStore';

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
 * 运动画面
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
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-4 select-none"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      {/* 组信息 */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="text-lg text-gray-600">
          第{currentTotalSet}组 · {modeText}模式
        </span>
        <span className="text-gray-400 ml-2">
          {currentTotalSet}/{totalSets}组
        </span>
      </motion.div>

      {/* 环形进度 */}
      <ProgressRing
        progress={isPaused ? 0 : phaseProgress}
        color={phaseColor}
        size={260}
        strokeWidth={14}
      >
        <div className="text-center">
          {isPaused ? (
            <>
              <div className="text-4xl mb-2">⏸️</div>
              <div className="text-2xl font-bold text-gray-500">已暂停</div>
            </>
          ) : (
            <>
              <motion.div
                key={phase}
                className="text-4xl font-bold"
                style={{ color: phaseColor }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {phaseText}
              </motion.div>
              <div className="text-3xl text-gray-600 mt-2 tabular-nums">
                {secondsRemaining}秒
              </div>
            </>
          )}
        </div>
      </ProgressRing>

      {/* 次数进度 */}
      {!isResting && !isPaused && (
        <motion.div
          className="text-xl text-gray-600 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          第 <span className="font-semibold text-primary">{currentRep}</span> / {currentPlan.repsCount} 次
        </motion.div>
      )}

      {isResting && !isPaused && (
        <motion.div
          className="text-lg text-gray-500 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          组间休息中，准备下一组
        </motion.div>
      )}

      {/* 总进度条 */}
      <div className="w-full max-w-xs mt-8">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-center text-gray-500 text-sm mt-2">
          总进度 {totalProgress}%
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex gap-4 mt-10">
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
      </div>
    </motion.div>
  );
};

