import { useEffect } from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { CountdownScreen } from '../../components/CountdownScreen';
import { ExerciseScreen } from '../../components/ExerciseScreen';
import { useTrainingStore } from '../../store/trainingStore';
import { useTimer } from '../../hooks/useTimer';
import { getTotalSets } from '../../utils/calculations';

/**
 * 训练页（Taro 版本）
 */
export default function TrainingPage() {
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
      Taro.redirectTo({ url: '/pages/complete/index' });
    }
  }, [phase]);

  // 处理结束
  const handleStop = () => {
    stopTraining();
    Taro.navigateBack();
  };

  // 倒计时阶段
  if (phase === 'countdown') {
    return <CountdownScreen seconds={state.secondsRemaining} />;
  }

  // 获取当前计划
  const currentPlan = plan[planIndex] || plan[0];
  const totalSets = getTotalSets(settings);

  return (
    <View>
      <ExerciseScreen
        state={state}
        settings={settings}
        currentPlan={currentPlan}
        totalSets={totalSets}
        onPause={pauseTraining}
        onResume={resumeTraining}
        onStop={handleStop}
      />
    </View>
  );
}

