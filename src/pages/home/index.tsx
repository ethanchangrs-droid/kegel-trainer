import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Button } from '../../components/Button';
import {
  QuickModeSettings,
  SustainedModeSettings,
  GeneralSettings,
} from '../../components/SettingsCard';
import { useTrainingStore } from '../../store/trainingStore';
import { calculateTotalDuration, formatDurationChinese } from '../../utils/calculations';
import './index.scss';

/**
 * 首页/设置页（Taro 版本）
 */
export default function HomePage() {
  const { settings, updateSettings, resetSettings, startTraining } = useTrainingStore();

  const totalDuration = calculateTotalDuration(settings);
  const durationText = formatDurationChinese(totalDuration);

  const handleStart = () => {
    startTraining();
    Taro.navigateTo({ url: '/pages/training/index' });
  };

  return (
    <View className="home-page">
      <View className="home-container">
        {/* 标题 */}
        <View className="home-header animate-fade-in">
          <Text className="home-title">提刚助手</Text>
          <Text className="home-subtitle">轻松锻炼，健康生活</Text>
        </View>

        {/* 设置区域 */}
        <View className="home-settings animate-slide-up delay-100">
          {/* 不持续模式 */}
          <QuickModeSettings
            sets={settings.quickSets}
            repsPerSet={settings.quickRepsPerSet}
            onSetsChange={(v) => updateSettings({ quickSets: v })}
            onRepsChange={(v) => updateSettings({ quickRepsPerSet: v })}
          />

          {/* 持续模式 */}
          <SustainedModeSettings
            sets={settings.sustainedSets}
            repsPerSet={settings.sustainedRepsPerSet}
            contractDuration={settings.sustainedContractDuration}
            onSetsChange={(v) => updateSettings({ sustainedSets: v })}
            onRepsChange={(v) => updateSettings({ sustainedRepsPerSet: v })}
            onContractDurationChange={(v) => updateSettings({ sustainedContractDuration: v })}
          />

          {/* 通用设置 */}
          <GeneralSettings
            relaxDuration={settings.relaxDuration}
            restBetweenSets={settings.restBetweenSets}
            onRelaxDurationChange={(v) => updateSettings({ relaxDuration: v })}
            onRestBetweenSetsChange={(v) => updateSettings({ restBetweenSets: v })}
          />
        </View>

        {/* 预计时长 */}
        <View className="home-duration animate-fade-in delay-200">
          <Text className="home-duration-text">
            预计训练时长: <Text className="home-duration-value">{durationText}</Text>
          </Text>
        </View>

        {/* 开始按钮 */}
        <View className="home-start animate-slide-up delay-300">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStart}
          >
            开始训练
          </Button>
        </View>

        {/* 重置链接 */}
        <View className="home-reset animate-fade-in delay-400">
          <Text className="home-reset-text" onClick={resetSettings}>
            恢复默认设置
          </Text>
        </View>

        {/* 温馨提示 */}
        <View className="home-tip animate-fade-in delay-500">
          <Text className="home-tip-text">
            💡 温馨提示：本产品非商用，若发现商用情况，
          </Text>
          <Text className="home-tip-text">
            欢迎+v反馈 <Text className="home-tip-wechat">wowrussell01</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

