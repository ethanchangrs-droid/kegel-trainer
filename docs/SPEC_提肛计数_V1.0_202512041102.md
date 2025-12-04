# 提肛运动计数功能 - 技术规格文档 (SPEC)

## 文档信息
| 项目 | 内容 |
|------|------|
| 版本 | V1.0 |
| 创建日期 | 2025-12-04 11:02 |
| 更新日期 | 2025-12-04 11:02 |
| 关联PRD | PRD_提肛计数_V1.1_202512041052.md |
| 关联UI | UI_提肛计数_V1.0_202512041102.md |
| 状态 | 设计中 |

## 版本历史
| 版本 | 日期 | 更新内容 |
|------|------|----------|
| V1.0 | 2025-12-04 | 初始版本，完整技术规格 |

---

## 1. 技术架构

### 1.1 技术选型

| 层级 | 技术方案 | 说明 |
|------|---------|------|
| 框架 | **React 18** | 组件化开发，状态管理方便 |
| 构建工具 | **Vite** | 快速构建，开发体验好 |
| 语言 | **TypeScript** | 类型安全，代码可维护 |
| 样式 | **Tailwind CSS** | 原子化CSS，快速开发 |
| 动画 | **Framer Motion** | React动画库，流畅自然 |
| 部署 | **Vercel / Netlify** | 静态托管，CDN加速 |

### 1.2 项目结构

```
kegel-trainer/
├── public/
│   ├── favicon.ico
│   └── manifest.json          # PWA 配置
├── src/
│   ├── components/            # UI 组件
│   │   ├── common/            # 通用组件
│   │   │   ├── Button.tsx
│   │   │   ├── Slider.tsx
│   │   │   └── ProgressRing.tsx
│   │   ├── home/              # 首页组件
│   │   │   ├── SettingsCard.tsx
│   │   │   └── TrainingPreview.tsx
│   │   └── training/          # 训练页组件
│   │       ├── CountdownScreen.tsx
│   │       ├── ExerciseScreen.tsx
│   │       └── CompleteScreen.tsx
│   ├── hooks/                 # 自定义 Hooks
│   │   ├── useTimer.ts
│   │   ├── useTrainingState.ts
│   │   └── useSettings.ts
│   ├── store/                 # 状态管理
│   │   └── trainingStore.ts
│   ├── types/                 # 类型定义
│   │   └── index.ts
│   ├── utils/                 # 工具函数
│   │   └── calculations.ts
│   ├── styles/                # 全局样式
│   │   └── globals.css
│   ├── App.tsx                # 根组件
│   └── main.tsx               # 入口文件
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

### 1.3 架构图

```
┌─────────────────────────────────────────────────────────┐
│                        App.tsx                          │
│                     (路由/状态提供)                       │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│   HomePage    │   │ TrainingPage  │   │ CompletePage  │
│   (设置页面)   │   │  (训练页面)    │   │  (完成页面)   │
└───────────────┘   └───────────────┘   └───────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Training Store                        │
│              (Zustand 状态管理)                          │
│  - settings: 训练参数                                    │
│  - state: 当前训练状态                                   │
│  - actions: 开始/暂停/继续/结束                          │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Custom Hooks                         │
│  - useTimer: 计时器逻辑                                  │
│  - useTrainingState: 训练状态机                          │
│  - useSettings: 设置读写                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 2. 数据结构

### 2.1 类型定义

```typescript
// types/index.ts

/** 运动模式 */
export type ExerciseMode = 'quick' | 'sustained';

/** 训练阶段 */
export type TrainingPhase = 
  | 'idle'        // 空闲，等待开始
  | 'countdown'   // 开始前倒计时
  | 'contract'    // 收紧中
  | 'relax'       // 放松中
  | 'rest'        // 组间休息
  | 'paused'      // 已暂停
  | 'completed';  // 训练完成

/** 训练设置 */
export interface TrainingSettings {
  // 不持续模式设置
  quickSets: number;           // 组数 (1-5)
  quickRepsPerSet: number;     // 每组次数 (5-30)
  quickContractDuration: number; // 收紧时长，固定1秒
  
  // 持续模式设置
  sustainedSets: number;       // 组数 (1-5)
  sustainedRepsPerSet: number; // 每组次数 (5-30)
  sustainedContractDuration: number; // 收紧时长 (3-15秒)
  
  // 通用设置
  relaxDuration: number;       // 放松时长 (3-10秒)
  restBetweenSets: number;     // 组间休息 (10-30秒)
}

/** 默认设置 */
export const DEFAULT_SETTINGS: TrainingSettings = {
  quickSets: 2,
  quickRepsPerSet: 20,
  quickContractDuration: 1,
  sustainedSets: 1,
  sustainedRepsPerSet: 20,
  sustainedContractDuration: 10,
  relaxDuration: 5,
  restBetweenSets: 20,
};

/** 当前训练状态 */
export interface TrainingState {
  phase: TrainingPhase;        // 当前阶段
  currentMode: ExerciseMode;   // 当前模式
  currentSet: number;          // 当前组 (从1开始)
  currentRep: number;          // 当前次 (从1开始)
  secondsRemaining: number;    // 当前阶段剩余秒数
  totalProgress: number;       // 总进度 (0-100)
}

/** 训练结果统计 */
export interface TrainingResult {
  totalReps: number;           // 总次数
  totalDuration: number;       // 总时长（秒）
  completedSets: number;       // 完成组数
  isCompleted: boolean;        // 是否完整完成
}

/** 训练计划项 */
export interface TrainingPlanItem {
  mode: ExerciseMode;          // 模式
  setNumber: number;           // 第几组
  repsCount: number;           // 次数
  contractDuration: number;    // 收紧时长
  relaxDuration: number;       // 放松时长
}
```

### 2.2 状态管理 (Zustand Store)

```typescript
// store/trainingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TrainingStore {
  // 设置
  settings: TrainingSettings;
  updateSettings: (settings: Partial<TrainingSettings>) => void;
  resetSettings: () => void;
  
  // 训练状态
  state: TrainingState;
  
  // 动作
  startTraining: () => void;
  pauseTraining: () => void;
  resumeTraining: () => void;
  stopTraining: () => void;
  tick: () => void;  // 每秒调用
  
  // 结果
  result: TrainingResult | null;
}

export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      state: {
        phase: 'idle',
        currentMode: 'quick',
        currentSet: 1,
        currentRep: 1,
        secondsRemaining: 0,
        totalProgress: 0,
      },
      result: null,
      
      updateSettings: (newSettings) => 
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),
      
      resetSettings: () => 
        set({ settings: DEFAULT_SETTINGS }),
      
      startTraining: () => {
        // 初始化训练状态，进入倒计时阶段
        set({
          state: {
            phase: 'countdown',
            currentMode: 'quick',
            currentSet: 1,
            currentRep: 1,
            secondsRemaining: 3,  // 3秒倒计时
            totalProgress: 0,
          },
          result: null,
        });
      },
      
      pauseTraining: () => 
        set((state) => ({
          state: { ...state.state, phase: 'paused' }
        })),
      
      resumeTraining: () => {
        // 恢复到暂停前的阶段
        // 具体实现需要保存暂停前的阶段
      },
      
      stopTraining: () => {
        // 结束训练，计算结果
        set({
          state: { ...get().state, phase: 'completed' },
          result: calculateResult(get().state, get().settings),
        });
      },
      
      tick: () => {
        // 每秒更新状态的核心逻辑
        // 详见下方状态机实现
      },
    }),
    {
      name: 'kegel-settings',
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
```

---

## 3. 核心算法

### 3.1 训练计划生成

```typescript
// utils/calculations.ts

/** 生成训练计划队列 */
export function generateTrainingPlan(settings: TrainingSettings): TrainingPlanItem[] {
  const plan: TrainingPlanItem[] = [];
  
  // 添加不持续模式的组
  for (let i = 1; i <= settings.quickSets; i++) {
    plan.push({
      mode: 'quick',
      setNumber: i,
      repsCount: settings.quickRepsPerSet,
      contractDuration: settings.quickContractDuration,
      relaxDuration: settings.relaxDuration,
    });
  }
  
  // 添加持续模式的组
  for (let i = 1; i <= settings.sustainedSets; i++) {
    plan.push({
      mode: 'sustained',
      setNumber: i,
      repsCount: settings.sustainedRepsPerSet,
      contractDuration: settings.sustainedContractDuration,
      relaxDuration: settings.relaxDuration,
    });
  }
  
  return plan;
}

/** 计算总训练时长（秒） */
export function calculateTotalDuration(settings: TrainingSettings): number {
  const countdownTime = 3;
  
  // 不持续模式时长
  const quickTime = settings.quickSets * settings.quickRepsPerSet * 
    (settings.quickContractDuration + settings.relaxDuration);
  
  // 持续模式时长
  const sustainedTime = settings.sustainedSets * settings.sustainedRepsPerSet * 
    (settings.sustainedContractDuration + settings.relaxDuration);
  
  // 组间休息时长 (总组数 - 1)
  const totalSets = settings.quickSets + settings.sustainedSets;
  const restTime = (totalSets - 1) * settings.restBetweenSets;
  
  return countdownTime + quickTime + sustainedTime + restTime;
}

/** 计算总次数 */
export function calculateTotalReps(settings: TrainingSettings): number {
  return (settings.quickSets * settings.quickRepsPerSet) + 
         (settings.sustainedSets * settings.sustainedRepsPerSet);
}

/** 计算当前进度百分比 */
export function calculateProgress(
  completedReps: number, 
  settings: TrainingSettings
): number {
  const totalReps = calculateTotalReps(settings);
  return Math.round((completedReps / totalReps) * 100);
}
```

### 3.2 训练状态机

```typescript
// hooks/useTrainingState.ts

/** 状态转换逻辑 */
export function getNextState(
  currentState: TrainingState,
  settings: TrainingSettings,
  plan: TrainingPlanItem[]
): TrainingState {
  const { phase, currentMode, currentSet, currentRep, secondsRemaining } = currentState;
  
  // 如果还有剩余时间，仅减少秒数
  if (secondsRemaining > 1) {
    return {
      ...currentState,
      secondsRemaining: secondsRemaining - 1,
    };
  }
  
  // 时间耗尽，切换到下一阶段
  switch (phase) {
    case 'countdown':
      // 倒计时结束 → 开始第一次收紧
      return {
        ...currentState,
        phase: 'contract',
        secondsRemaining: plan[0].contractDuration,
      };
    
    case 'contract':
      // 收紧结束 → 进入放松
      return {
        ...currentState,
        phase: 'relax',
        secondsRemaining: plan[getCurrentPlanIndex(currentState, plan)].relaxDuration,
      };
    
    case 'relax':
      // 放松结束 → 判断下一步
      const currentPlan = plan[getCurrentPlanIndex(currentState, plan)];
      
      if (currentRep < currentPlan.repsCount) {
        // 当前组未完成 → 下一次收紧
        return {
          ...currentState,
          phase: 'contract',
          currentRep: currentRep + 1,
          secondsRemaining: currentPlan.contractDuration,
          totalProgress: calculateProgress(getCompletedReps(currentState) + 1, settings),
        };
      } else {
        // 当前组已完成
        const nextPlanIndex = getCurrentPlanIndex(currentState, plan) + 1;
        
        if (nextPlanIndex >= plan.length) {
          // 所有组完成 → 训练结束
          return {
            ...currentState,
            phase: 'completed',
            totalProgress: 100,
          };
        } else {
          // 进入组间休息
          return {
            ...currentState,
            phase: 'rest',
            secondsRemaining: settings.restBetweenSets,
          };
        }
      }
    
    case 'rest':
      // 休息结束 → 开始下一组
      const nextIndex = getCurrentPlanIndex(currentState, plan) + 1;
      const nextPlan = plan[nextIndex];
      
      return {
        ...currentState,
        phase: 'contract',
        currentMode: nextPlan.mode,
        currentSet: nextPlan.setNumber,
        currentRep: 1,
        secondsRemaining: nextPlan.contractDuration,
      };
    
    default:
      return currentState;
  }
}

/** 获取当前计划索引 */
function getCurrentPlanIndex(state: TrainingState, plan: TrainingPlanItem[]): number {
  let index = 0;
  for (let i = 0; i < plan.length; i++) {
    if (plan[i].mode === state.currentMode && plan[i].setNumber === state.currentSet) {
      index = i;
      break;
    }
  }
  return index;
}
```

### 3.3 计时器 Hook

```typescript
// hooks/useTimer.ts
import { useEffect, useRef } from 'react';

export function useTimer(
  isRunning: boolean,
  onTick: () => void,
  interval: number = 1000
) {
  const tickRef = useRef(onTick);
  
  // 保持 onTick 最新
  useEffect(() => {
    tickRef.current = onTick;
  }, [onTick]);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setInterval(() => {
      tickRef.current();
    }, interval);
    
    return () => clearInterval(timer);
  }, [isRunning, interval]);
}
```

---

## 4. 组件接口

### 4.1 环形进度条组件

```typescript
// components/common/ProgressRing.tsx

interface ProgressRingProps {
  /** 进度值 (0-100) */
  progress: number;
  /** 尺寸 (px) */
  size?: number;
  /** 环宽度 (px) */
  strokeWidth?: number;
  /** 进度环颜色 */
  color: string;
  /** 背景环颜色 */
  backgroundColor?: string;
  /** 中心内容 */
  children?: React.ReactNode;
  /** 动画时长 (ms) */
  animationDuration?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 240,
  strokeWidth = 12,
  color,
  backgroundColor = '#E0E0E0',
  children,
  animationDuration = 100,
}) => {
  // SVG 实现
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* 背景环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* 进度环 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: `stroke-dashoffset ${animationDuration}ms linear, stroke 300ms ease`,
          }}
        />
      </svg>
      {/* 中心内容 */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
```

### 4.2 滑块组件

```typescript
// components/common/Slider.tsx

interface SliderProps {
  /** 当前值 */
  value: number;
  /** 最小值 */
  min: number;
  /** 最大值 */
  max: number;
  /** 步长 */
  step?: number;
  /** 标签 */
  label: string;
  /** 单位 */
  unit: string;
  /** 值变化回调 */
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  label,
  unit,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-32 accent-teal-500"
        />
        <span className="w-16 text-right font-medium text-teal-600">
          {value}{unit}
        </span>
      </div>
    </div>
  );
};
```

### 4.3 按钮组件

```typescript
// components/common/Button.tsx

interface ButtonProps {
  /** 按钮类型 */
  variant?: 'primary' | 'secondary' | 'text';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否全宽 */
  fullWidth?: boolean;
  /** 点击回调 */
  onClick?: () => void;
  /** 子元素 */
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  onClick,
  children,
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-teal-500 text-white hover:bg-teal-600 active:scale-98',
    secondary: 'border-2 border-teal-500 text-teal-500 hover:bg-teal-50',
    text: 'text-gray-500 hover:text-gray-700',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

---

## 5. 页面实现

### 5.1 首页/设置页

```typescript
// pages/HomePage.tsx

export const HomePage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useTrainingStore();
  const navigate = useNavigate();
  
  const totalDuration = calculateTotalDuration(settings);
  const minutes = Math.floor(totalDuration / 60);
  const seconds = totalDuration % 60;
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        {/* 标题 */}
        <header className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800">提肛助手</h1>
          <p className="text-gray-500 mt-2">轻松锻炼，健康生活</p>
        </header>
        
        {/* 不持续模式设置 */}
        <SettingsCard title="不持续模式">
          <Slider
            label="组数"
            value={settings.quickSets}
            min={1} max={5}
            unit="组"
            onChange={(v) => updateSettings({ quickSets: v })}
          />
          <Slider
            label="每组次数"
            value={settings.quickRepsPerSet}
            min={5} max={30}
            unit="次"
            onChange={(v) => updateSettings({ quickRepsPerSet: v })}
          />
        </SettingsCard>
        
        {/* 持续模式设置 */}
        <SettingsCard title="持续模式">
          <Slider
            label="组数"
            value={settings.sustainedSets}
            min={1} max={5}
            unit="组"
            onChange={(v) => updateSettings({ sustainedSets: v })}
          />
          <Slider
            label="每组次数"
            value={settings.sustainedRepsPerSet}
            min={5} max={30}
            unit="次"
            onChange={(v) => updateSettings({ sustainedRepsPerSet: v })}
          />
          <Slider
            label="收紧时间"
            value={settings.sustainedContractDuration}
            min={3} max={15}
            unit="秒"
            onChange={(v) => updateSettings({ sustainedContractDuration: v })}
          />
        </SettingsCard>
        
        {/* 通用设置 */}
        <SettingsCard title="通用设置">
          <Slider
            label="放松时间"
            value={settings.relaxDuration}
            min={3} max={10}
            unit="秒"
            onChange={(v) => updateSettings({ relaxDuration: v })}
          />
          <Slider
            label="组间间隔"
            value={settings.restBetweenSets}
            min={10} max={30}
            unit="秒"
            onChange={(v) => updateSettings({ restBetweenSets: v })}
          />
        </SettingsCard>
        
        {/* 预计时长 */}
        <div className="text-center text-gray-500 my-6">
          预计训练时长: {minutes}分{seconds > 0 ? `${seconds}秒` : ''}
        </div>
        
        {/* 开始按钮 */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => navigate('/training')}
        >
          开始训练
        </Button>
        
        {/* 重置链接 */}
        <button
          className="w-full text-center text-gray-400 mt-4 text-sm"
          onClick={resetSettings}
        >
          恢复默认设置
        </button>
      </div>
    </div>
  );
};
```

### 5.2 训练页

```typescript
// pages/TrainingPage.tsx

export const TrainingPage: React.FC = () => {
  const { state, settings, startTraining, pauseTraining, resumeTraining, stopTraining, tick } = useTrainingStore();
  
  // 启动训练
  useEffect(() => {
    startTraining();
  }, []);
  
  // 计时器
  useTimer(
    state.phase !== 'idle' && state.phase !== 'paused' && state.phase !== 'completed',
    tick
  );
  
  // 根据阶段渲染不同内容
  if (state.phase === 'countdown') {
    return <CountdownScreen seconds={state.secondsRemaining} />;
  }
  
  if (state.phase === 'completed') {
    return <CompleteScreen />;
  }
  
  // 获取当前显示内容
  const isContracting = state.phase === 'contract';
  const isResting = state.phase === 'rest';
  const isPaused = state.phase === 'paused';
  
  const statusText = isResting ? '休息' : (isContracting ? '收紧' : '放松');
  const statusColor = isResting ? '#80CBC4' : (isContracting ? '#FF7043' : '#26A69A');
  
  const currentPlan = getCurrentPlan(state, settings);
  const phaseDuration = isResting 
    ? settings.restBetweenSets 
    : (isContracting ? currentPlan.contractDuration : currentPlan.relaxDuration);
  
  const progress = ((phaseDuration - state.secondsRemaining) / phaseDuration) * 100;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* 组信息 */}
      <div className="text-center mb-8">
        <span className="text-lg text-gray-600">
          第{state.currentSet}组 · {state.currentMode === 'quick' ? '不持续' : '持续'}模式
        </span>
      </div>
      
      {/* 环形进度 */}
      <ProgressRing
        progress={progress}
        color={statusColor}
        size={240}
      >
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color: statusColor }}>
            {statusText}
          </div>
          <div className="text-2xl text-gray-600 mt-2">
            {state.secondsRemaining}秒
          </div>
        </div>
      </ProgressRing>
      
      {/* 次数进度 */}
      {!isResting && (
        <div className="text-xl text-gray-600 mt-8">
          第 {state.currentRep} / {currentPlan.repsCount} 次
        </div>
      )}
      
      {/* 总进度条 */}
      <div className="w-full max-w-xs mt-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${state.totalProgress}%` }}
          />
        </div>
        <div className="text-center text-gray-500 text-sm mt-2">
          总进度 {state.totalProgress}%
        </div>
      </div>
      
      {/* 控制按钮 */}
      <div className="flex gap-4 mt-12">
        <Button
          variant="secondary"
          onClick={isPaused ? resumeTraining : pauseTraining}
        >
          {isPaused ? '继续' : '暂停'}
        </Button>
        <Button
          variant="text"
          onClick={stopTraining}
        >
          结束
        </Button>
      </div>
    </div>
  );
};
```

---

## 6. 性能优化

### 6.1 动画性能
- 使用 `transform` 和 `opacity` 进行动画，触发 GPU 加速
- SVG 进度环使用 `stroke-dashoffset` 动画
- 避免在动画中触发布局重排

### 6.2 渲染优化
- 使用 `React.memo` 包裹纯展示组件
- 使用 `useMemo` 缓存计算结果
- 状态更新粒度最小化

### 6.3 代码分割
```typescript
// 路由级代码分割
const TrainingPage = lazy(() => import('./pages/TrainingPage'));
const CompletePage = lazy(() => import('./pages/CompletePage'));
```

---

## 7. 测试策略

### 7.1 单元测试

| 模块 | 测试内容 |
|------|---------|
| calculations | 时长计算、进度计算 |
| trainingState | 状态转换逻辑 |
| components | 组件渲染、交互 |

### 7.2 测试用例示例

```typescript
// calculations.test.ts
describe('calculateTotalDuration', () => {
  it('should calculate duration with default settings', () => {
    const duration = calculateTotalDuration(DEFAULT_SETTINGS);
    // 3 + (2*20*6) + (1*20*15) + (2*20) = 3 + 240 + 300 + 40 = 583秒
    expect(duration).toBe(583);
  });
});

describe('getNextState', () => {
  it('should transition from contract to relax', () => {
    const state: TrainingState = {
      phase: 'contract',
      currentMode: 'quick',
      currentSet: 1,
      currentRep: 1,
      secondsRemaining: 1,
      totalProgress: 0,
    };
    
    const nextState = getNextState(state, DEFAULT_SETTINGS, plan);
    expect(nextState.phase).toBe('relax');
  });
});
```

---

## 8. 部署方案

### 8.1 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
```

### 8.2 部署流程

```
代码提交 → GitHub Actions → 构建 → 部署到 Vercel/Netlify
```

### 8.3 PWA 配置 (可选)

```json
// public/manifest.json
{
  "name": "提肛助手",
  "short_name": "提肛助手",
  "description": "提肛运动计数引导工具",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFBFC",
  "theme_color": "#26A69A",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 9. 开发计划

### 9.1 开发阶段

| 阶段 | 内容 | 预估时间 |
|------|------|---------|
| 1 | 项目初始化、基础组件 | 2小时 |
| 2 | 首页/设置页实现 | 2小时 |
| 3 | 训练状态机、计时器 | 3小时 |
| 4 | 训练页面、动画效果 | 3小时 |
| 5 | 完成页、测试优化 | 2小时 |
| 6 | 部署上线 | 1小时 |

**总计: 约 13 小时**

### 9.2 技术风险

| 风险 | 应对方案 |
|------|---------|
| 移动端浏览器兼容性 | 使用标准CSS，测试主流浏览器 |
| 计时器精度 | 使用 requestAnimationFrame 配合 Date.now() |
| 状态管理复杂度 | 状态机模式，清晰的状态转换 |

