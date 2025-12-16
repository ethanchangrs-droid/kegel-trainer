import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Button } from '../../components/Button';
import { useTrainingStore } from '../../store/trainingStore';
import { formatDuration } from '../../utils/calculations';
import './index.scss';

/**
 * 完成页（Taro 版本）
 */
export default function CompletePage() {
  const { result, startTraining } = useTrainingStore();

  const stats = result || {
    totalReps: 0,
    totalDuration: 0,
    completedSets: 0,
    isCompleted: false,
  };

  const encourageText = stats.isCompleted
    ? '太棒了！完美完成训练 💪'
    : '继续加油！坚持就是胜利 💪';

  const handleRestart = () => {
    startTraining();
    Taro.redirectTo({ url: '/pages/training/index' });
  };

  const handleBackHome = () => {
    Taro.redirectTo({ url: '/pages/home/index' });
  };

  return (
    <View className="complete-page">
      {/* 庆祝图标 */}
      <Text className="complete-icon animate-fade-in">
        {stats.isCompleted ? '🎉' : '👍'}
      </Text>

      {/* 标题 */}
      <Text className="complete-title animate-slide-up delay-100">
        {stats.isCompleted ? '训练完成！' : '本次训练结束'}
      </Text>

      {/* 统计卡片 */}
      <View className="complete-card animate-slide-up delay-200">
        <Text className="complete-card-title">本次训练</Text>
        <View className="complete-stats">
          <View className="complete-stat-row">
            <Text className="complete-stat-label">总次数</Text>
            <Text className="complete-stat-value">{stats.totalReps} 次</Text>
          </View>
          <View className="complete-stat-row">
            <Text className="complete-stat-label">总时长</Text>
            <Text className="complete-stat-value">{formatDuration(stats.totalDuration)}</Text>
          </View>
          <View className="complete-stat-row">
            <Text className="complete-stat-label">完成组数</Text>
            <Text className="complete-stat-value">{stats.completedSets} 组</Text>
          </View>
        </View>
      </View>

      {/* 鼓励文字 */}
      <Text className="complete-encourage animate-fade-in delay-300">
        {encourageText}
      </Text>

      {/* 按钮 */}
      <View className="complete-buttons animate-slide-up delay-400">
        <Button variant="primary" size="lg" fullWidth onClick={handleRestart}>
          再来一次
        </Button>
        <View className="complete-button-space" />
        <Button variant="text" fullWidth onClick={handleBackHome}>
          返回首页
        </Button>
      </View>
    </View>
  );
}

