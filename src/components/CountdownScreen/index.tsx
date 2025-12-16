import { View, Text } from '@tarojs/components';
import { ProgressRing } from '../ProgressRing';
import './index.scss';

interface CountdownScreenProps {
  seconds: number;
}

/**
 * 倒计时屏幕（Taro 版本）
 */
export const CountdownScreen: React.FC<CountdownScreenProps> = ({ seconds }) => {
  const progress = ((3 - seconds) / 3) * 100;

  return (
    <View className="countdown-screen animate-fade-in">
      <Text className="countdown-hint animate-slide-up">准备开始</Text>

      <View className="countdown-ring">
        <ProgressRing
          progress={progress}
          color="#FFC107"
          size={200}
          strokeWidth={10}
          pulse
          canvasId="countdownRing"
        >
          <Text className="countdown-number animate-pulse">{seconds}</Text>
        </ProgressRing>
      </View>

      <Text className="countdown-tip animate-fade-in delay-300">即将开始训练...</Text>
    </View>
  );
};

