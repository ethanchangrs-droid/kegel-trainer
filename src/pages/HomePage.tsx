import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import {
  QuickModeSettings,
  SustainedModeSettings,
  GeneralSettings,
} from '../components/home/SettingsCard';
import { useTrainingStore } from '../store/trainingStore';
import { calculateTotalDuration, formatDurationChinese } from '../utils/calculations';

interface HomePageProps {
  onStart: () => void;
}

/**
 * 首页/设置页
 */
export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const { settings, updateSettings, resetSettings, startTraining } = useTrainingStore();

  const totalDuration = calculateTotalDuration(settings);
  const durationText = formatDurationChinese(totalDuration);

  const handleStart = () => {
    startTraining();
    onStart();
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-primary/5 to-white p-4 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md mx-auto">
        {/* 标题 */}
        <header className="text-center py-6 sm:py-8">
          <motion.h1
            className="text-3xl sm:text-4xl font-bold text-gray-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            提刚助手
          </motion.h1>
          <motion.p
            className="text-gray-500 mt-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            轻松锻炼，健康生活
          </motion.p>
        </header>

        {/* 设置区域 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
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
        </motion.div>

        {/* 预计时长 */}
        <motion.div
          className="text-center text-gray-500 my-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          预计训练时长: <span className="font-medium text-primary">{durationText}</span>
        </motion.div>

        {/* 开始按钮 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleStart}
          >
            开始训练
          </Button>
        </motion.div>

        {/* 重置链接 */}
        <motion.div
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
            onClick={resetSettings}
          >
            恢复默认设置
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

