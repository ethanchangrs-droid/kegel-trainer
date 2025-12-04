import { motion } from 'framer-motion';
import { ProgressRing } from '../common/ProgressRing';

interface CountdownScreenProps {
  seconds: number;
}

/**
 * 倒计时屏幕
 */
export const CountdownScreen: React.FC<CountdownScreenProps> = ({ seconds }) => {
  const progress = ((3 - seconds) / 3) * 100;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-countdown/10 to-white flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.p
        className="text-xl text-gray-600 mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        准备开始
      </motion.p>

      <ProgressRing
        progress={progress}
        color="#FFC107"
        size={200}
        strokeWidth={10}
        pulse
      >
        <motion.span
          key={seconds}
          className="text-6xl font-bold text-countdown"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {seconds}
        </motion.span>
      </ProgressRing>

      <motion.p
        className="text-gray-400 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        即将开始训练...
      </motion.p>
    </motion.div>
  );
};

