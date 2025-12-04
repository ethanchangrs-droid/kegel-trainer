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
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 滑块组件
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  min,
  max,
  step = 1,
  label,
  unit,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700 text-sm sm:text-base">{label}</span>
      <div className="flex items-center gap-2 sm:gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-24 sm:w-32 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                     accent-primary disabled:cursor-not-allowed disabled:opacity-50
                     [&::-webkit-slider-thumb]:appearance-none
                     [&::-webkit-slider-thumb]:w-5
                     [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:bg-primary
                     [&::-webkit-slider-thumb]:shadow-md
                     [&::-webkit-slider-thumb]:cursor-pointer
                     [&::-webkit-slider-thumb]:transition-transform
                     [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <span className="w-14 sm:w-16 text-right font-medium text-primary tabular-nums">
          {value}{unit}
        </span>
      </div>
    </div>
  );
};

