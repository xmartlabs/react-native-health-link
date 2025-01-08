import { HealthLinkDataType } from './dataTypes';
import {
  BloodGlucoseUnit,
  HeartRateUnit,
  HeighUnit,
  StepsUnit,
  WeightUnit,
} from './units';

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

/**
 * Represents the types of data that are supported in the write operation.
 *
 * @typedef {WriteDataType}
 * @property {HealthLinkDataType.BloodGlucose} BloodGlucose - Represents blood glucose data.
 * @property {HealthLinkDataType.Height} Height - Represents height data.
 * @property {HealthLinkDataType.Weight} Weight - Represents weight data.
 * @property {HealthLinkDataType.HeartRate} HeartRate - Represents heart rate data.
 * @property {HealthLinkDataType.Steps} Steps - Represents steps data.
 */
export type WriteDataType =
  | HealthLinkDataType.BloodGlucose
  | HealthLinkDataType.Height
  | HealthLinkDataType.Weight
  | HealthLinkDataType.HeartRate
  | HealthLinkDataType.Steps;
