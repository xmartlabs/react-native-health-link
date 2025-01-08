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
