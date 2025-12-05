import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CountdownScreen } from '../components/training/CountdownScreen';
import { ExerciseScreen } from '../components/training/ExerciseScreen';
import { useTrainingStore } from '../store/trainingStore';
import { useTimer } from '../hooks/useTimer';
import { getTotalSets } from '../utils/calculations';

interface TrainingPageProps {
  onComplete: () => void;
  onExit: () => void;
}

/**
 * 训练页
 */
export const TrainingPage: React.FC<TrainingPageProps> = ({ onComplete, onExit }) => {
  const {
    state,
    settings,
    plan,
    planIndex,
    tick,
    pauseTraining,
    resumeTraining,
    stopTraining,
  } = useTrainingStore();

  const { phase } = state;
  const isRunning = phase !== 'idle' && phase !== 'paused' && phase !== 'completed';

  // 计时器
  useTimer(isRunning, tick, 1000);

  // 训练完成时跳转
  useEffect(() => {
    if (phase === 'completed') {
      onComplete();
    }
  }, [phase, onComplete]);

  // 处理结束
  const handleStop = () => {
    stopTraining();
    onExit();
  };

  // 倒计时阶段
  if (phase === 'countdown') {
    return <CountdownScreen seconds={state.secondsRemaining} />;
  }

  // 获取当前计划
  const currentPlan = plan[planIndex] || plan[0];
  const totalSets = getTotalSets(settings);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ExerciseScreen
        state={state}
        settings={settings}
        currentPlan={currentPlan}
        totalSets={totalSets}
        onPause={pauseTraining}
        onResume={resumeTraining}
        onStop={handleStop}
      />
    </motion.div>
  );
};




