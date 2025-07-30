import { type HealthValueOptions } from 'react-native-health';
import { HealthLinkDataType } from '../types/dataTypes';
import { Platform } from 'react-native';
import type { HealthConnectRecord } from 'react-native-health-connect';
import {
  BloodGlucoseUnit,
  EnergyUnit,
  HeighUnit,
  unitToIosUnitMap,
  WeightUnit,
} from '../types/units';
import type { WriteDataType, WriteOptions } from '../types/save';

const AppleHealthKit = require('react-native-health');

export const serializeWriteOptions = <T extends WriteDataType>(
  dataType: T,
  options: WriteOptions<T>
): HealthValueOptions | HealthConnectRecord | null => {
  if (Platform.OS === 'ios') {
    if (!options.unit) return null;
    const value = options.value ?? 0;
    const iosOptions: HealthValueOptions = {
      unit: unitToIosUnitMap[options.unit],
      value:
        options.unit === WeightUnit.Kg
          ? value * 1000
          : options.unit === HeighUnit.Cm
            ? value / 100
            : value,
    };
    return iosOptions;
  }

  if (Platform.OS === 'android') {
    const androidOptions = {
      startTime: options.startDate ?? new Date().toISOString(),
      endTime: options.endDate ?? new Date().toISOString(),
    };

    switch (dataType) {
      case HealthLinkDataType.BloodGlucose: {
        const {
          relationToMeal = 0,
          mealType = 0,
          specimenSource = 0,
        } = options.metadata || {};
        const unit =
          options.unit === BloodGlucoseUnit.MgPerdL
            ? 'milligramsPerDeciliter'
            : 'millimolesPerLiter';
        return {
          ...androidOptions,
          recordType: 'BloodGlucose',
          relationToMeal,
          mealType,
          specimenSource,
          time: options.time ?? androidOptions.startTime,
          level: { unit, value: options.value as number },
        };
      }
      case HealthLinkDataType.Steps:
        return {
          ...androidOptions,
          recordType: 'Steps',
          count: options.value ?? 0,
        };
      case HealthLinkDataType.Weight: {
        const weightUnit =
          options.unit === WeightUnit.Kg
            ? 'kilograms'
            : options.unit === WeightUnit.Gram
              ? 'grams'
              : 'pounds';
        return {
          ...androidOptions,
          recordType: 'Weight',
          time: options.time ?? androidOptions.startTime,
          weight: { unit: weightUnit, value: options.value as number },
        };
      }
      case HealthLinkDataType.Height: {
        const heightUnit =
          options.unit === HeighUnit.Cm || options.unit === HeighUnit.Meter
            ? 'meters'
            : options.unit === HeighUnit.Foot
              ? 'feet'
              : 'inches';
        const heightValue =
          options.unit === HeighUnit.Cm
            ? (options.value as number) / 100
            : (options.value as number);
        return {
          ...androidOptions,
          recordType: 'Height',
          time: options.time ?? androidOptions.startTime,
          height: { unit: heightUnit, value: heightValue },
        };
      }
      case HealthLinkDataType.HeartRate:
        return {
          ...androidOptions,
          recordType: 'HeartRate',
          samples: [
            {
              time: options.time ?? androidOptions.startTime,
              beatsPerMinute: options.value as number,
            },
          ],
        };
      case HealthLinkDataType.ActiveEnergyBurned: {
        const energyUnit =
          options.unit === EnergyUnit.Calories
            ? 'calories'
            : options.unit === EnergyUnit.Joules
              ? 'joules'
              : 'kilojoules';
        return {
          ...androidOptions,
          recordType: 'ActiveCaloriesBurned',
          energy: { unit: energyUnit, value: options.value as number },
        };
      }
      case HealthLinkDataType.BasalEnergyBurned: {
        const energyUnit =
          options.unit === EnergyUnit.Calories ? 'kilocaloriesPerDay' : 'watts';
        const energyValue =
          options.unit === EnergyUnit.Calories
            ? (options.value as number)
            : options.unit === EnergyUnit.Joules
              ? (options.value as number) / 86400 // Convert J/day to watts
              : (options.value as number) / 86.4; // Convert kJ/day to watts
        return {
          ...androidOptions,
          recordType: 'BasalMetabolicRate',
          time: options.time ?? androidOptions.startTime,
          basalMetabolicRate: { unit: energyUnit, value: energyValue },
        };
      }
      default:
        return null;
    }
  }

  return null;
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
    ActiveEnergyBurned: AppleHealthKit.saveActiveEnergyBurned,
    BasalEnergyBurned: AppleHealthKit.saveBasalEnergyBurned,
  };
  return dataTypeMap[dataType] || (() => {});
};
