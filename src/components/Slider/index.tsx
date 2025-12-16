import { View, Text, Slider as TaroSlider } from '@tarojs/components';
import type { SliderProps as TaroSliderProps } from '@tarojs/components';
import './index.scss';

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
 * 滑块组件（Taro 版本）
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
  const handleChange: TaroSliderProps['onChange'] = (e) => {
    onChange(e.detail.value);
  };

  return (
    <View className="slider-container">
      <Text className="slider-label">{label}</Text>
      <View className="slider-control">
        <TaroSlider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          activeColor="#26A69A"
          backgroundColor="#E0E0E0"
          blockColor="#26A69A"
          blockSize={20}
          className="slider-input"
        />
        <Text className="slider-value">
          {value}{unit}
        </Text>
      </View>
    </View>
  );
};

