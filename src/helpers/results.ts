import { Platform } from 'react-native';
import {
  type ReadRecordsResult,
  type RecordResult,
} from 'react-native-health-connect';

import type { HealthValue } from 'react-native-health';
import { HealthLinkDataType, type ReadOptions } from '../types/dataTypes';
import {
  androidHeightUnitMap,
  androidWeightUnitMap,
  BloodGlucoseUnit,
} from '../types/units';
import type { HealthLinkDataValue } from '../types/results';

const AppleHealthKit = require('react-native-health');

export const dataValueDeserializer = <T extends HealthLinkDataType>(
  dataType: T,
  options: ReadOptions,
  dataValue: HealthValue | RecordResult<any>
): HealthLinkDataValue<T> | null => {
  if (Platform.OS === 'ios') {
    let iosDataValue = dataValue as HealthValue;
    let result = {
      value: iosDataValue.value,
      id: iosDataValue.id,
      time: iosDataValue.startDate,
      metadata: {
        ...iosDataValue.metadata,
        source: (iosDataValue as any).sourceId,
      },
    };

    switch (dataType) {
      case HealthLinkDataType.BloodPressure:
        return {
          ...result,
          value: {
            systolic: (iosDataValue as any).bloodPressureSystolicValue,
            diastolic: (iosDataValue as any).bloodPressureDiastolicValue,
          },
        } as HealthLinkDataValue<T>;
      case HealthLinkDataType.OxygenSaturation:
        return {
          ...result,
          value: iosDataValue.value * 100,
        } as HealthLinkDataValue<T>;
      default:
        return result as HealthLinkDataValue<T>;
    }
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
        } as unknown as HealthLinkDataValue<T>;
      }
      case HealthLinkDataType.BloodPressure: {
        const bloodPressureDataValue =
          androidDataValue as RecordResult<'BloodPressure'>;
        return {
          ...result,
          value: {
            systolic: bloodPressureDataValue.systolic.inMillimetersOfMercury,
            diastolic: bloodPressureDataValue.diastolic.inMillimetersOfMercury,
          },
        } as HealthLinkDataValue<T>;
      }
      case HealthLinkDataType.Height: {
        const heightDataValue = androidDataValue as RecordResult<'Height'>;
        return {
          ...result,
          value: androidHeightUnitMap(heightDataValue, options.unit),
        } as HealthLinkDataValue<T>;
      }
      case HealthLinkDataType.Weight: {
        const weightDataValue = androidDataValue as RecordResult<'Weight'>;
        return {
          ...result,
          value: androidWeightUnitMap(weightDataValue, options.unit),
        } as HealthLinkDataValue<T>;
      }
      case HealthLinkDataType.HeartRate: {
        const heartRateDataValue =
          androidDataValue as RecordResult<'HeartRate'>;
        return {
          ...result,
          value: heartRateDataValue.samples[0]?.beatsPerMinute,
          time: heartRateDataValue.samples[0]?.time,
        } as HealthLinkDataValue<T>;
      }
      case HealthLinkDataType.RestingHeartRate: {
        const restingHeartRateDataValue =
          androidDataValue as RecordResult<'RestingHeartRate'>;
        return {
          ...result,
          value: restingHeartRateDataValue.beatsPerMinute,
        } as HealthLinkDataValue<T>;
      }
      case HealthLinkDataType.OxygenSaturation: {
        const oxygenSaturationDataValue =
          androidDataValue as RecordResult<'OxygenSaturation'>;
        return {
          ...result,
          value: oxygenSaturationDataValue.percentage,
        } as HealthLinkDataValue<T>;
      }
      case HealthLinkDataType.Steps: {
        const stepsDataValue = androidDataValue as RecordResult<'Steps'>;
        return {
          ...result,
          value: stepsDataValue.count,
        } as HealthLinkDataValue<T>;
      }
      default:
        return result as HealthLinkDataValue<T>;
    }
  }
  return null;
};

export const readDataResultDeserializer = <T extends HealthLinkDataType>(
  dataType: T,
  options: ReadOptions,
  data: ReadRecordsResult<T> | HealthValue[]
): HealthLinkDataValue<T>[] => {
  let dataValueArray: RecordResult<T>[] | HealthValue[] =
    Platform.OS === 'ios'
      ? (data as HealthValue[])
      : (data as ReadRecordsResult<T>).records;
  return dataValueArray.reduce((acc, d) => {
    const deserializedValue = dataValueDeserializer(dataType, options, d);
    if (deserializedValue !== null) {
      acc.push(deserializedValue);
    }
    return acc;
  }, [] as HealthLinkDataValue<T>[]);
};

export const readIosCallback = (
  dataType: HealthLinkDataType,
  options: ReadOptions
) => {
  return new Promise((resolve, reject) => {
    dataValueToIosReadFunction(dataType)(options, (err: any, results: any) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(results);
    });
  });
};

export const dataValueToIosReadFunction = (dataType: HealthLinkDataType) => {
  const dataTypeMap: { [key in HealthLinkDataType]?: any } = {
    BloodGlucose: AppleHealthKit.getBloodGlucoseSamples,
    Height: AppleHealthKit.getHeightSamples,
    Weight: AppleHealthKit.getWeightSamples,
    HeartRate: AppleHealthKit.getHeartRateSamples,
    RestingHeartRate: AppleHealthKit.getRestingHeartRateSamples,
    OxygenSaturation: AppleHealthKit.getOxygenSaturationSamples,
    BloodPressure: AppleHealthKit.getBloodPressureSamples,
    Steps: AppleHealthKit.getDailyStepCountSamples,
  };
  return dataTypeMap[dataType] || (() => {});
};
