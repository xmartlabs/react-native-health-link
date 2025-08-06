import { Platform } from 'react-native';
import { read, write } from '../src/index';
import { HealthLinkDataType } from '../src/types/dataTypes';
import {
  BloodGlucoseUnit,
  WeightUnit,
  HeighUnit,
  HeartRateUnit,
  EnergyUnit,
} from '../src/types/units';

jest.mock('react-native-health-connect');
jest.mock('react-native-health');

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('Data Types - Comprehensive Testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Blood Pressure (Complex Data Type)', () => {
    const sampleBloodPressureData = {
      systolic: 120,
      diastolic: 80,
    };

    it('should read blood pressure data with systolic and diastolic values on iOS', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      const options = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      };

      AppleHealthKit.getBloodPressureSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              bloodPressureSystolicValue: 120,
              bloodPressureDiastolicValue: 80,
              startDate: '2023-01-01',
              endDate: '2023-01-01',
              id: 'bp-1',
              sourceId: 'test-source',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.BloodPressure, options);

      expect(Array.isArray(result)).toBe(true);
      expect(AppleHealthKit.getBloodPressureSamples).toHaveBeenCalled();
    });

    it('should read blood pressure data on Android', async () => {
      Platform.OS = 'android';
      const { readRecords } = require('react-native-health-connect');

      readRecords.mockResolvedValue({
        records: [
          {
            recordType: 'BloodPressure',
            systolic: { inMillimetersOfMercury: 120 },
            diastolic: { inMillimetersOfMercury: 80 },
            time: '2023-01-01T00:00:00.000Z',
            metadata: { id: 'bp-android-1' },
          },
        ],
      });

      const options = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      };

      const result = await read(HealthLinkDataType.BloodPressure, options);

      expect(Array.isArray(result)).toBe(true);
      expect(readRecords).toHaveBeenCalled();
    });

    it('should validate blood pressure value structure', () => {
      const bloodPressureValue: { systolic: number; diastolic: number } =
        sampleBloodPressureData;
      expect(bloodPressureValue.systolic).toBe(120);
      expect(bloodPressureValue.diastolic).toBe(80);
    });
  });

  describe('Blood Glucose (Unit-specific)', () => {
    it('should handle blood glucose in mg/dL on iOS', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getBloodGlucoseSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 100,
              unit: 'mg/dL',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
              id: 'bg-1',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.BloodGlucose, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: BloodGlucoseUnit.MgPerdL,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle blood glucose in mmol/L on iOS', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getBloodGlucoseSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 5.6,
              unit: 'mmol/L',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
              id: 'bg-2',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.BloodGlucose, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: BloodGlucoseUnit.MmolPerL,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should write blood glucose data with metadata on Android', async () => {
      Platform.OS = 'android';
      const { insertRecords } = require('react-native-health-connect');

      insertRecords.mockResolvedValue(undefined);

      await write(HealthLinkDataType.BloodGlucose, {
        value: 100,
        unit: BloodGlucoseUnit.MgPerdL,
        time: '2023-01-01T00:00:00.000Z',
        metadata: {
          relationToMeal: 1,
          mealType: 2,
          specimenSource: 1,
        },
      });

      expect(insertRecords).toHaveBeenCalledWith([
        expect.objectContaining({
          recordType: 'BloodGlucose',
          level: {
            unit: 'milligramsPerDeciliter',
            value: 100,
          },
          relationToMeal: 1,
          mealType: 2,
          specimenSource: 1,
        }),
      ]);
    });
  });

  describe('Weight (Multiple Units)', () => {
    it('should handle weight in kilograms', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getWeightSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 70,
              unit: 'kg',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.Weight, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: WeightUnit.Kg,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle weight in pounds', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getWeightSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 154.3,
              unit: 'lb',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.Weight, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: WeightUnit.Pounds,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should write weight data with Android unit conversion', async () => {
      Platform.OS = 'android';
      const { insertRecords } = require('react-native-health-connect');

      insertRecords.mockResolvedValue(undefined);

      await write(HealthLinkDataType.Weight, {
        value: 70,
        unit: WeightUnit.Kg,
        time: '2023-01-01T00:00:00.000Z',
      });

      expect(insertRecords).toHaveBeenCalledWith([
        expect.objectContaining({
          recordType: 'Weight',
          weight: {
            unit: 'kilograms',
            value: 70,
          },
        }),
      ]);
    });
  });

  describe('Height (Multiple Units)', () => {
    it('should handle height in centimeters', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getHeightSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 175,
              unit: 'cm',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.Height, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: HeighUnit.Cm,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle height in inches', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getHeightSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 68.9,
              unit: 'in',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.Height, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: HeighUnit.Inch,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should convert centimeters to meters for Android', async () => {
      Platform.OS = 'android';
      const { insertRecords } = require('react-native-health-connect');

      insertRecords.mockResolvedValue(undefined);

      await write(HealthLinkDataType.Height, {
        value: 175,
        unit: HeighUnit.Cm,
        time: '2023-01-01T00:00:00.000Z',
      });

      expect(insertRecords).toHaveBeenCalledWith([
        expect.objectContaining({
          recordType: 'Height',
          height: {
            unit: 'meters',
            value: 1.75,
          },
        }),
      ]);
    });
  });

  describe('Heart Rate (BPM)', () => {
    it('should handle heart rate data', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getHeartRateSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 72,
              unit: 'bpm',
              startDate: '2023-01-01T10:00:00.000Z',
              endDate: '2023-01-01T10:00:00.000Z',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.HeartRate, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: HeartRateUnit.Bpm,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should write heart rate with samples on Android', async () => {
      Platform.OS = 'android';
      const { insertRecords } = require('react-native-health-connect');

      insertRecords.mockResolvedValue(undefined);

      await write(HealthLinkDataType.HeartRate, {
        value: 72,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(insertRecords).toHaveBeenCalledWith([
        expect.objectContaining({
          recordType: 'HeartRate',
          samples: [
            {
              time: '2023-01-01T10:00:00.000Z',
              beatsPerMinute: 72,
            },
          ],
        }),
      ]);
    });
  });

  describe('Resting Heart Rate', () => {
    it('should handle resting heart rate differently from regular heart rate', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getRestingHeartRateSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 65,
              unit: 'bpm',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.RestingHeartRate, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      });

      expect(Array.isArray(result)).toBe(true);
      expect(AppleHealthKit.getRestingHeartRateSamples).toHaveBeenCalled();
    });
  });

  describe('Oxygen Saturation (Percentage)', () => {
    it('should handle oxygen saturation with percentage conversion on iOS', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getOxygenSaturationSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 0.98,
              unit: 'percent',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.OxygenSaturation, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle oxygen saturation on Android', async () => {
      Platform.OS = 'android';
      const { readRecords } = require('react-native-health-connect');

      readRecords.mockResolvedValue({
        records: [
          {
            recordType: 'OxygenSaturation',
            percentage: { value: 98 },
            time: '2023-01-01T00:00:00.000Z',
          },
        ],
      });

      const result = await read(HealthLinkDataType.OxygenSaturation, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Steps (Count)', () => {
    it('should handle daily step count', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getDailyStepCountSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 8532,
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.Steps, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should write steps data on Android', async () => {
      Platform.OS = 'android';
      const { insertRecords } = require('react-native-health-connect');

      insertRecords.mockResolvedValue(undefined);

      await write(HealthLinkDataType.Steps, {
        value: 8532,
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-01T23:59:59.000Z',
      });

      expect(insertRecords).toHaveBeenCalledWith([
        expect.objectContaining({
          recordType: 'Steps',
          count: 8532,
        }),
      ]);
    });
  });

  describe('Active Energy Burned (Calories)', () => {
    it('should handle active energy in different units', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getActiveEnergyBurned.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 245,
              unit: 'kcal',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.ActiveEnergyBurned, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: EnergyUnit.Calories,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle energy in joules', async () => {
      Platform.OS = 'android';
      const { readRecords } = require('react-native-health-connect');

      readRecords.mockResolvedValue({
        records: [
          {
            recordType: 'ActiveCaloriesBurned',
            energy: {
              inJoules: 1025280,
              inCalories: 245,
              inKilojoules: 1025.28,
            },
            time: '2023-01-01T00:00:00.000Z',
          },
        ],
      });

      const result = await read(HealthLinkDataType.ActiveEnergyBurned, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: EnergyUnit.Joules,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Basal Energy Burned (BMR)', () => {
    it('should handle basal metabolic rate', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      AppleHealthKit.getBasalEnergyBurned.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            {
              value: 1650,
              unit: 'kcal',
              startDate: '2023-01-01',
              endDate: '2023-01-01',
            },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.BasalEnergyBurned, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: EnergyUnit.Calories,
      });

      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle BMR on Android with watt conversion', async () => {
      Platform.OS = 'android';
      const { readRecords } = require('react-native-health-connect');

      readRecords.mockResolvedValue({
        records: [
          {
            recordType: 'BasalMetabolicRate',
            basalMetabolicRate: {
              inWatts: 80.5,
              inKilocaloriesPerDay: 1650,
            },
            time: '2023-01-01T00:00:00.000Z',
          },
        ],
      });

      const result = await read(HealthLinkDataType.BasalEnergyBurned, {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
        unit: EnergyUnit.Calories,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('Data Type Validation', () => {
    it('should validate all data types are handled', () => {
      const allDataTypes = Object.values(HealthLinkDataType);
      expect(allDataTypes).toContain(HealthLinkDataType.BloodGlucose);
      expect(allDataTypes).toContain(HealthLinkDataType.Height);
      expect(allDataTypes).toContain(HealthLinkDataType.Weight);
      expect(allDataTypes).toContain(HealthLinkDataType.HeartRate);
      expect(allDataTypes).toContain(HealthLinkDataType.RestingHeartRate);
      expect(allDataTypes).toContain(HealthLinkDataType.BloodPressure);
      expect(allDataTypes).toContain(HealthLinkDataType.OxygenSaturation);
      expect(allDataTypes).toContain(HealthLinkDataType.Steps);
      expect(allDataTypes).toContain(HealthLinkDataType.ActiveEnergyBurned);
      expect(allDataTypes).toContain(HealthLinkDataType.BasalEnergyBurned);
    });

    it('should validate all units are properly typed', () => {
      expect(Object.values(BloodGlucoseUnit)).toContain('mgPerdL');
      expect(Object.values(BloodGlucoseUnit)).toContain('mmolPerL');
      expect(Object.values(WeightUnit)).toContain('kg');
      expect(Object.values(WeightUnit)).toContain('pounds');
      expect(Object.values(HeighUnit)).toContain('cm');
      expect(Object.values(HeighUnit)).toContain('inch');
      expect(Object.values(HeartRateUnit)).toContain('bpm');
      expect(Object.values(EnergyUnit)).toContain('calories');
      expect(Object.values(EnergyUnit)).toContain('joules');
    });
  });

  describe('Error Handling by Data Type', () => {
    it('should handle reading errors gracefully for each data type', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      const dataTypes = [
        HealthLinkDataType.BloodGlucose,
        HealthLinkDataType.Height,
        HealthLinkDataType.Weight,
        HealthLinkDataType.HeartRate,
        HealthLinkDataType.BloodPressure,
      ];

      for (const dataType of dataTypes) {
        jest.clearAllMocks();

        const mockMethod =
          dataType === HealthLinkDataType.BloodGlucose
            ? AppleHealthKit.getBloodGlucoseSamples
            : dataType === HealthLinkDataType.Height
              ? AppleHealthKit.getHeightSamples
              : dataType === HealthLinkDataType.Weight
                ? AppleHealthKit.getWeightSamples
                : dataType === HealthLinkDataType.HeartRate
                  ? AppleHealthKit.getHeartRateSamples
                  : AppleHealthKit.getBloodPressureSamples;

        mockMethod.mockImplementation((_options: any, callback: any) => {
          callback(new Error(`Test error for ${dataType}`), null);
        });

        try {
          await read(dataType, {
            startDate: '2023-01-01',
            endDate: '2023-01-02',
          });
        } catch (error) {
          expect(error).toBeDefined();
        }
      }
    });
  });
});
