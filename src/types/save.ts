import type { HealthUnit } from 'react-native-health';
import { HealthLinkDataType } from './dataTypes';

const AppleHealthKit = require('react-native-health');

export interface WriteOptionsBase<T extends WriteDataType> {
  value: T extends HealthLinkDataType.BloodPressure
    ? { diastolic: number; systolic: number }
    : number;
  time?: string;
  unit?: HealthUnit;
  metadata?: {
    source?: string;
  } & Record<string, any>;
}

export type WriteOptions<T extends WriteDataType> = WriteOptionsBase<T> &
  (T extends HealthLinkDataType.Steps
    ? { startDate: string; endDate: string }
    : { startDate?: never; endDate?: never });

export type WriteDataType =
  | HealthLinkDataType.BloodGlucose
  | HealthLinkDataType.Height
  | HealthLinkDataType.Weight
  | HealthLinkDataType.HeartRate
  | HealthLinkDataType.Steps;

export const serializeWriteOptions = <T extends WriteDataType>(
  dataType: T,
  options: WriteOptions<T>
): WriteOptions<T> => {
  switch (dataType) {
    default:
      return options;
  }
};

export const writeIosCallback = <T extends WriteDataType>(
  dataType: WriteDataType,
  options: WriteOptions<T>
) => {
  return new Promise((resolve, reject) => {
    dataValueToIosWriteFunction(dataType)(options, (err: any, results: any) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(results);
    });
  });
};

export const dataValueToIosWriteFunction = (dataType: WriteDataType) => {
  const dataTypeMap: { [key in WriteDataType]?: any } = {
    BloodGlucose: AppleHealthKit.saveBloodGlucoseSample,
    Height: AppleHealthKit.saveHeight,
    Weight: AppleHealthKit.saveWeight,
    HeartRate: AppleHealthKit.saveHeartRateSample,
    Steps: AppleHealthKit.saveSteps,
  };
  return dataTypeMap[dataType] || (() => {});
};
