import { Slider } from '../common/Slider';

interface SettingsCardProps {
  /** 卡片标题 */
  title: string;
  /** 子元素 */
  children: React.ReactNode;
}

/**
 * 设置卡片组件
 */
export const SettingsCard: React.FC<SettingsCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl p-4 mb-4 shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-2 pb-2 border-b border-gray-100">
        {title}
      </h3>
      <div className="divide-y divide-gray-50">
        {children}
      </div>
    </div>
  );
};

interface QuickModeSettingsProps {
  sets: number;
  repsPerSet: number;
  onSetsChange: (value: number) => void;
  onRepsChange: (value: number) => void;
}

/**
 * 收放自如模式设置
 */
export const QuickModeSettings: React.FC<QuickModeSettingsProps> = ({
  sets,
  repsPerSet,
  onSetsChange,
  onRepsChange,
}) => {
  return (
    <SettingsCard title="收放自如">
      <p className="text-sm text-gray-400 -mt-1 mb-2">收紧一下就放松</p>
      <Slider
        label="组数"
        value={sets}
        min={0}
        max={5}
        unit="组"
        onChange={onSetsChange}
      />
      <Slider
        label="每组次数"
        value={repsPerSet}
        min={5}
        max={30}
        unit="次"
        onChange={onRepsChange}
        disabled={sets === 0}
      />
    </SettingsCard>
  );
};

interface SustainedModeSettingsProps {
  sets: number;
  repsPerSet: number;
  contractDuration: number;
  onSetsChange: (value: number) => void;
  onRepsChange: (value: number) => void;
  onContractDurationChange: (value: number) => void;
}

/**
 * 坚持一下模式设置
 */
export const SustainedModeSettings: React.FC<SustainedModeSettingsProps> = ({
  sets,
  repsPerSet,
  contractDuration,
  onSetsChange,
  onRepsChange,
  onContractDurationChange,
}) => {
  return (
    <SettingsCard title="坚持一下">
      <p className="text-sm text-gray-400 -mt-1 mb-2">收紧后坚持一会儿再放松</p>
      <Slider
        label="组数"
        value={sets}
        min={0}
        max={5}
        unit="组"
        onChange={onSetsChange}
      />
      <Slider
        label="每组次数"
        value={repsPerSet}
        min={5}
        max={30}
        unit="次"
        onChange={onRepsChange}
        disabled={sets === 0}
      />
      <Slider
        label="收紧时间"
        value={contractDuration}
        min={3}
        max={15}
        unit="秒"
        onChange={onContractDurationChange}
        disabled={sets === 0}
      />
    </SettingsCard>
  );
};

interface GeneralSettingsProps {
  relaxDuration: number;
  restBetweenSets: number;
  onRelaxDurationChange: (value: number) => void;
  onRestBetweenSetsChange: (value: number) => void;
}

/**
 * 通用设置
 */
export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  relaxDuration,
  restBetweenSets,
  onRelaxDurationChange,
  onRestBetweenSetsChange,
}) => {
  return (
    <SettingsCard title="通用设置">
      <Slider
        label="放松时间"
        value={relaxDuration}
        min={3}
        max={10}
        unit="秒"
        onChange={onRelaxDurationChange}
      />
      <Slider
        label="组间间隔"
        value={restBetweenSets}
        min={10}
        max={30}
        unit="秒"
        onChange={onRestBetweenSetsChange}
      />
    </SettingsCard>
  );
};

