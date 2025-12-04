import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { TrainingPage } from './pages/TrainingPage';
import { CompletePage } from './pages/CompletePage';
import { useTrainingStore } from './store/trainingStore';

/** 页面类型 */
type PageType = 'home' | 'training' | 'complete';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { result, startTraining } = useTrainingStore();

  const handleStartTraining = () => {
    setCurrentPage('training');
  };

  const handleRestartTraining = () => {
    startTraining(); // 重新初始化训练状态
    setCurrentPage('training');
  };

  const handleTrainingComplete = () => {
    setCurrentPage('complete');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        {currentPage === 'home' && (
          <HomePage key="home" onStart={handleStartTraining} />
        )}
        {currentPage === 'training' && (
          <TrainingPage
            key="training"
            onComplete={handleTrainingComplete}
            onExit={handleBackToHome}
          />
        )}
        {currentPage === 'complete' && (
          <CompletePage
            key="complete"
            result={result}
            onRestart={handleRestartTraining}
            onBackHome={handleBackToHome}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

