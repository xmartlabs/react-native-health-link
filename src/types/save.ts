import type { HealthInputOptions, HealthUnit } from 'react-native-health';
import { HealthLinkDataType } from './dataTypes';
import { Platform } from 'react-native';
import type { HealthConnectRecord } from 'react-native-health-connect';
import {
  androidBloodGlucoseUnitMap,
  BloodGlucoseUnit,
  StepsUnit,
  WeightUnit,
} from './units';

const AppleHealthKit = require('react-native-health');

export interface WriteOptionsBase<T extends WriteDataType> {
  value?: T extends HealthLinkDataType.BloodPressure
    ? { diastolic: number; systolic: number }
    : number;
  time?: string;
  unit?: Partial<HealthUnit>;
  metadata?: {
    source?: string;
  } & Record<string, any>;
}

export type Unit = BloodGlucoseUnit | WeightUnit | StepsUnit;

export type WriteOptions<T extends WriteDataType> = WriteOptionsBase<T> &
  (T extends HealthLinkDataType.Steps
    ? { startDate: string; endDate: string }
    : { startDate?: string; endDate?: string });

export type WriteDataType =
  | HealthLinkDataType.BloodGlucose
  | HealthLinkDataType.Height
  | HealthLinkDataType.Weight
  | HealthLinkDataType.HeartRate
  | HealthLinkDataType.Steps;

export const serializeWriteOptions = <T extends WriteDataType>(
  dataType: T,
  options: WriteOptions<T>
): HealthInputOptions | HealthConnectRecord | null => {
  if (Platform.OS === 'ios') {
    switch (dataType) {
      default:
        return options;
    }
  } else if (Platform.OS === 'android') {
    let androidOptions = {
      recordType: dataType,
      startTime: options.startDate,
      endTime: options.endDate,
    };
    switch (dataType) {
      case HealthLinkDataType.BloodGlucose:
        const unit = options.unit
          ? androidBloodGlucoseUnitMap[
              options.unit as unknown as BloodGlucoseUnit
            ]
          : 'millimolesPerLiter';
        //@ts-ignore
        return {
          ...androidOptions,
          level: {
            unit,
            value: options.value,
          },
        };
      default:
        return null;
    }
  }
  return options;
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
