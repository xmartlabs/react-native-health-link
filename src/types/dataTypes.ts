import { type ReadRecordsOptions } from 'react-native-health-connect';

export enum HealthLinkDataType {
  BloodGlucose = 'BloodGlucose',
  Height = 'Height',
  Weight = 'Weight',
  LeanBodyMass = 'LeanBodyMass',
  HeartRate = 'HeartRate',
  RestingHeartRate = 'RestingHeartRate',
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
    ascendingOrder: options.ascending,
    pageSize: options.limit,
  };
};
