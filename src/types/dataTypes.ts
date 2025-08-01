import { type ReadRecordsOptions } from 'react-native-health-connect';

/**
 * Enum representing various types of health data that can be tracked.
 *
 * @enum {string}
 * @property {string} BloodGlucose - Represents blood glucose levels.
 * @property {string} Height - Represents height measurement.
 * @property {string} Weight - Represents weight measurement.
 * @property {string} HeartRate - Represents heart rate measurement.
 * @property {string} RestingHeartRate - Represents resting heart rate measurement.
 * @property {string} BloodPressure - Represents blood pressure measurement.
 * @property {string} OxygenSaturation - Represents oxygen saturation levels.
 * @property {string} Steps - Represents the number of steps taken.
 * @property {string} ActiveEnergyBurned - Represents active calories burned through physical activity.
 * @property {string} BasalEnergyBurned - Represents basal/resting calories burned.
 */
export enum HealthLinkDataType {
  BloodGlucose = 'BloodGlucose',
  Height = 'Height',
  Weight = 'Weight',
  HeartRate = 'HeartRate',
  RestingHeartRate = 'RestingHeartRate',
  BloodPressure = 'BloodPressure',
  OxygenSaturation = 'OxygenSaturation',
  Steps = 'Steps',
  ActiveEnergyBurned = 'ActiveEnergyBurned',
  BasalEnergyBurned = 'BasalEnergyBurned',
}

export type TimeOperator = 'after' | 'before' | 'between';

export interface ReadOptions {
  startDate?: string;
  endDate?: string;
  ascending?: boolean;
  limit?: number;
  unit?: string;
}

export const optionsToAndroidOptions = (
  options: ReadOptions
): ReadRecordsOptions => {
  let operator: TimeOperator = 'before';
  if (options.startDate && options.endDate) {
    operator = 'between';
  } else if (options.startDate) {
    operator = 'after';
  }

  return {
    timeRangeFilter: {
      operator,
      startTime: options.startDate!,
      endTime: options.endDate!,
    },
    ascendingOrder: options.ascending ?? false,
    pageSize: options.limit,
  };
};

type AndroidType =
  | 'BloodGlucose'
  | 'Height'
  | 'Weight'
  | 'HeartRate'
  | 'RestingHeartRate'
  | 'BloodPressure'
  | 'OxygenSaturation'
  | 'Steps'
  | 'ActiveCaloriesBurned'
  | 'BasalMetabolicRate';

export const healthLinkToAndroidType = (
  dataType: HealthLinkDataType
): AndroidType => {
  const typeMap: Record<HealthLinkDataType, AndroidType> = {
    [HealthLinkDataType.BloodGlucose]: 'BloodGlucose',
    [HealthLinkDataType.Height]: 'Height',
    [HealthLinkDataType.Weight]: 'Weight',
    [HealthLinkDataType.HeartRate]: 'HeartRate',
    [HealthLinkDataType.RestingHeartRate]: 'RestingHeartRate',
    [HealthLinkDataType.BloodPressure]: 'BloodPressure',
    [HealthLinkDataType.OxygenSaturation]: 'OxygenSaturation',
    [HealthLinkDataType.Steps]: 'Steps',
    [HealthLinkDataType.ActiveEnergyBurned]: 'ActiveCaloriesBurned',
    [HealthLinkDataType.BasalEnergyBurned]: 'BasalMetabolicRate',
  };
  return typeMap[dataType];
};
