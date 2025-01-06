import { HealthLinkDataType } from './dataTypes';

export type HealthLinkDataValueMap = {
  [HealthLinkDataType.BloodGlucose]: number;
  [HealthLinkDataType.Height]: number;
  [HealthLinkDataType.Weight]: number;
  [HealthLinkDataType.HeartRate]: number;
  [HealthLinkDataType.RestingHeartRate]: number;
  [HealthLinkDataType.BloodPressure]: { systolic: number; diastolic: number };
  [HealthLinkDataType.OxygenSaturation]: number;
  [HealthLinkDataType.Steps]: number;
};

export interface HealthLinkDataValue<T extends HealthLinkDataType> {
  value: HealthLinkDataValueMap[T];
  id?: string;
  time: string;
  metadata: {
    source?: string;
  } & Record<string, any>;
}
