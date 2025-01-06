import { type HealthValueOptions } from 'react-native-health';
import { HealthLinkDataType } from './dataTypes';
import { Platform } from 'react-native';
import type { HealthConnectRecord } from 'react-native-health-connect';
import {
  BloodGlucoseUnit,
  HeartRateUnit,
  HeighUnit,
  StepsUnit,
  unitToIosUnitMap,
  WeightUnit,
} from './units';

const AppleHealthKit = require('react-native-health');

export interface WriteOptionsBase<T extends WriteDataType> {
  value?: T extends HealthLinkDataType.BloodPressure
    ? { diastolic: number; systolic: number }
    : number;
  time?: string;
  unit?: Unit;
  metadata?: {
    source?: string;
  } & Record<string, any>;
}

export type Unit =
  | BloodGlucoseUnit
  | WeightUnit
  | StepsUnit
  | HeighUnit
  | HeartRateUnit;

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
): HealthValueOptions | HealthConnectRecord | null => {
  if (Platform.OS === 'ios') {
    switch (dataType) {
      default:
        let iosOptions: HealthValueOptions = {
          unit: options.unit && unitToIosUnitMap[options.unit],
          value:
            options.unit === WeightUnit.Kg
              ? (options.value ?? 0) * 1000
              : options.unit === HeighUnit.Cm
                ? (options.value ?? 0) / 100
                : (options.value ?? 0),
        };
        return iosOptions;
    }
  } else if (Platform.OS === 'android') {
    let androidOptions = {
      startTime: options.startDate,
      endTime: options.endDate,
    };
    switch (dataType) {
      case HealthLinkDataType.BloodGlucose:
        return {
          ...androidOptions,
          recordType: 'BloodGlucose',
          relationToMeal: options.metadata?.relationToMeal ?? 0,
          mealType: options.metadata?.mealType ?? 0,
          specimenSource: options.metadata?.specimenSource ?? 0,
          time: options.time ?? options.startDate ?? new Date().toISOString(),
          level: {
            unit:
              options.unit === BloodGlucoseUnit.MgPerdL
                ? 'milligramsPerDeciliter'
                : 'millimolesPerLiter',
            value: options.value as number,
          },
        };
      case HealthLinkDataType.Steps:
        return {
          ...androidOptions,
          recordType: 'Steps',
          count: options.value ?? 0,
          startTime: options.startDate ?? new Date().toISOString(),
          endTime: options.endDate ?? new Date().toISOString(),
        };
      case HealthLinkDataType.Weight:
        return {
          ...androidOptions,
          recordType: 'Weight',
          time: options.time ?? options.startDate ?? new Date().toISOString(),
          weight: {
            unit:
              (options.unit as unknown as WeightUnit) === WeightUnit.Kg
                ? 'kilograms'
                : (options.unit as unknown as WeightUnit) === WeightUnit.Gram
                  ? 'grams'
                  : 'pounds',
            value: options.value as number,
          },
        };
      case HealthLinkDataType.Height:
        return {
          ...androidOptions,
          recordType: 'Height',
          time: options.time ?? options.startDate ?? new Date().toISOString(),
          height: {
            unit:
              (options.unit as unknown as HeighUnit) === HeighUnit.Cm ||
              (options.unit as unknown as HeighUnit) === HeighUnit.Meter
                ? 'meters'
                : (options.unit as unknown as HeighUnit) === HeighUnit.Foot
                  ? 'feet'
                  : 'inches',
            value:
              (options.unit as unknown as HeighUnit) === HeighUnit.Cm
                ? (options.value as number) / 100
                : (options.value as number),
          },
        };
      case HealthLinkDataType.HeartRate:
        return {
          ...androidOptions,
          recordType: 'HeartRate',
          startTime: options.startDate ?? new Date().toISOString(),
          endTime: options.endDate ?? new Date().toISOString(),
          samples: [
            {
              time:
                options.time ?? options.startDate ?? new Date().toISOString(),
              beatsPerMinute: options.value as number,
            },
          ],
        };
      default:
        return null;
    }
  }
  //@ts-ignore
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
