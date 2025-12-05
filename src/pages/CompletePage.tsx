import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import type { TrainingResult } from '../types';
import { formatDuration } from '../utils/calculations';

interface CompletePageProps {
  result: TrainingResult | null;
  onRestart: () => void;
  onBackHome: () => void;
}

/**
 * 完成页
 */
export const CompletePage: React.FC<CompletePageProps> = ({
  result,
  onRestart,
  onBackHome,
}) => {
  const stats = result || {
    totalReps: 0,
    totalDuration: 0,
    completedSets: 0,
    isCompleted: false,
  };

  const encourageText = stats.isCompleted
    ? '太棒了！完美完成训练 💪'
    : '继续加油！坚持就是胜利 💪';

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 庆祝图标 */}
      <motion.div
        className="text-7xl mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      >
        {stats.isCompleted ? '🎉' : '👍'}
      </motion.div>

      {/* 标题 */}
      <motion.h1
        className="text-3xl font-bold text-gray-800 mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {stats.isCompleted ? '训练完成！' : '本次训练结束'}
      </motion.h1>

      {/* 统计卡片 */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-lg w-full max-w-xs mb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">
          本次训练
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">总次数</span>
            <span className="font-semibold text-primary">{stats.totalReps} 次</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">总时长</span>
            <span className="font-semibold text-primary">{formatDuration(stats.totalDuration)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">完成组数</span>
            <span className="font-semibold text-primary">{stats.completedSets} 组</span>
          </div>
        </div>
      </motion.div>

      {/* 鼓励文字 */}
      <motion.p
        className="text-gray-600 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {encourageText}
      </motion.p>

      {/* 按钮 */}
      <motion.div
        className="w-full max-w-xs space-y-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Button variant="primary" size="lg" fullWidth onClick={onRestart}>
          再来一次
        </Button>
        <Button variant="text" fullWidth onClick={onBackHome}>
          返回首页
        </Button>
      </motion.div>
    </motion.div>
  );
};




