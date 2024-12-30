import { Platform } from 'react-native';
import {
  type ReadRecordsResult,
  type RecordResult,
} from 'react-native-health-connect';

import type { HealthValue } from 'react-native-health';
import { HealthLinkDataType, type ReadOptions } from './dataTypes';
import { BloodGlucoseUnit } from './units';

const AppleHealthKit = require('react-native-health');

export interface HealthLinkDataValue {
  value: any;
  id?: string;
  time: string;
  metadata: {
    source?: string;
  } & { [key: string]: any };
}

export const dataValueDeserializer = (
  dataType: HealthLinkDataType,
  options: ReadOptions,
  dataValue: HealthValue | RecordResult<any>
): HealthLinkDataValue | null => {
  console.log(dataValue);
  if (Platform.OS === 'ios' && 'value' in dataValue) {
    return {
      value: dataValue.value,
      id: dataValue.id,
      time: dataValue.startDate,
      metadata: { ...dataValue.metadata, source: (dataValue as any).sourceId },
    };
  } else if (Platform.OS === 'android') {
    let androidDataValue = dataValue as RecordResult<any>;
    let result = {
      id: androidDataValue.metadata?.id,
      metadata: {
        ...androidDataValue.metadata,
        source: androidDataValue.metadata?.dataOrigin as string,
      },
      time: (androidDataValue as any).time,
    };
    switch (dataType) {
      case HealthLinkDataType.BloodGlucose: {
        const bloodGlucoseDataValue =
          androidDataValue as RecordResult<'BloodGlucose'>;
        return {
          ...result,
          metadata: {
            ...result.metadata,
            relationToMeal: bloodGlucoseDataValue.relationToMeal,
            mealType: bloodGlucoseDataValue.mealType,
            specimenSource: bloodGlucoseDataValue.specimenSource,
          },
          value:
            options?.unit === BloodGlucoseUnit.MgPerdL
              ? bloodGlucoseDataValue.level?.inMilligramsPerDeciliter
              : bloodGlucoseDataValue.level?.inMillimolesPerLiter,
        };
      }
    }
  }
  return null;
};

export const readDataResultDeserializer = (
  dataType: HealthLinkDataType,
  options: ReadOptions,
  data: ReadRecordsResult<any> | HealthValue[]
) => {
  let dataValueArray: RecordResult<any>[] | HealthValue[] =
    Platform.OS === 'ios'
      ? (data as HealthValue[])
      : (data as ReadRecordsResult<any>).records;
  return dataValueArray.map((d) => {
    return dataValueDeserializer(dataType, options, d);
  });
};

export const readIosCallback = (
  dataType: HealthLinkDataType,
  options: ReadOptions
) => {
  return new Promise((resolve, reject) => {
    dataValueToIosReadFunction(dataType)(options, (err: any, results: any) => {
      if (err) {
        reject(err);
      }
      resolve(results);
    });
  });
};

export const dataValueToIosReadFunction = (dataType: HealthLinkDataType) => {
  const dataTypeMap: { [key in HealthLinkDataType]?: any } = {
    BloodGlucose: AppleHealthKit.getBloodGlucoseSamples,
    Height: AppleHealthKit.getLatestHeight,
    Weight: AppleHealthKit.getLatestWeight,
    LeanBodyMass: AppleHealthKit.getLeanBodyMass,
    HeartRate: AppleHealthKit.getHeartRateSamples,
    RestingHeartRate: AppleHealthKit.getRestingHeartRate,
  };
  return dataTypeMap[dataType] || (() => {});
};
