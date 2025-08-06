import { Platform } from 'react-native';
import { HealthLinkDataType } from '../src/types/dataTypes';
import { BloodGlucoseUnit, WeightUnit, HeighUnit } from '../src/types/units';

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

import { serializeWriteOptions } from '../src/helpers/save';

describe('Data Serialization and Platform-Specific Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('iOS Serialization', () => {
    beforeEach(() => {
      Platform.OS = 'ios';
    });

    it('should return null for iOS when no unit is provided', () => {
      const result = serializeWriteOptions(HealthLinkDataType.Weight, {
        value: 70,
      });

      expect(result).toBeNull();
    });

    it('should convert kg to grams for iOS weight', () => {
      const result = serializeWriteOptions(HealthLinkDataType.Weight, {
        value: 70,
        unit: WeightUnit.Kg,
      });

      expect(result).toMatchObject({
        value: 70000,
      });
    });

    it('should convert cm to meters for iOS height', () => {
      const result = serializeWriteOptions(HealthLinkDataType.Height, {
        value: 175,
        unit: HeighUnit.Cm,
      });

      expect(result).toMatchObject({
        value: 1.75,
      });
    });
  });

  describe('Android Serialization', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('should serialize blood glucose with metadata', () => {
      const result = serializeWriteOptions(HealthLinkDataType.BloodGlucose, {
        value: 100,
        unit: BloodGlucoseUnit.MgPerdL,
        time: '2023-01-01T10:00:00.000Z',
        metadata: {
          relationToMeal: 1,
          mealType: 2,
          specimenSource: 1,
        },
      });

      expect(result).toMatchObject({
        recordType: 'BloodGlucose',
        level: {
          unit: 'milligramsPerDeciliter',
          value: 100,
        },
        relationToMeal: 1,
        mealType: 2,
        specimenSource: 1,
        time: '2023-01-01T10:00:00.000Z',
      });
    });

    it('should serialize weight with unit conversion', () => {
      const result = serializeWriteOptions(HealthLinkDataType.Weight, {
        value: 70,
        unit: WeightUnit.Kg,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(result).toMatchObject({
        recordType: 'Weight',
        weight: {
          unit: 'kilograms',
          value: 70,
        },
      });
    });

    it('should serialize height with cm to meters conversion', () => {
      const result = serializeWriteOptions(HealthLinkDataType.Height, {
        value: 175,
        unit: HeighUnit.Cm,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(result).toMatchObject({
        recordType: 'Height',
        height: {
          unit: 'meters',
          value: 1.75,
        },
      });
    });

    it('should serialize heart rate with samples array', () => {
      const result = serializeWriteOptions(HealthLinkDataType.HeartRate, {
        value: 72,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(result).toMatchObject({
        recordType: 'HeartRate',
        samples: [
          {
            time: '2023-01-01T10:00:00.000Z',
            beatsPerMinute: 72,
          },
        ],
      });
    });

    it('should handle blood glucose in mmol/L', () => {
      const result = serializeWriteOptions(HealthLinkDataType.BloodGlucose, {
        value: 5.6,
        unit: BloodGlucoseUnit.MmolPerL,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(result).toMatchObject({
        recordType: 'BloodGlucose',
        level: {
          unit: 'millimolesPerLiter',
          value: 5.6,
        },
      });
    });

    it('should handle weight in pounds', () => {
      const result = serializeWriteOptions(HealthLinkDataType.Weight, {
        value: 154,
        unit: WeightUnit.Pounds,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(result).toMatchObject({
        recordType: 'Weight',
        weight: {
          unit: 'pounds',
          value: 154,
        },
      });
    });

    it('should handle weight in grams', () => {
      const result = serializeWriteOptions(HealthLinkDataType.Weight, {
        value: 70000,
        unit: WeightUnit.Gram,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(result).toMatchObject({
        recordType: 'Weight',
        weight: {
          unit: 'grams',
          value: 70000,
        },
      });
    });

    it('should handle height in different units', () => {
      const metersResult = serializeWriteOptions(HealthLinkDataType.Height, {
        value: 1.75,
        unit: HeighUnit.Meter,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(metersResult).toMatchObject({
        height: {
          unit: 'meters',
          value: 1.75,
        },
      });

      const feetResult = serializeWriteOptions(HealthLinkDataType.Height, {
        value: 5.74,
        unit: HeighUnit.Foot,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(feetResult).toMatchObject({
        height: {
          unit: 'feet',
          value: 5.74,
        },
      });

      const inchesResult = serializeWriteOptions(HealthLinkDataType.Height, {
        value: 68.9,
        unit: HeighUnit.Inch,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(inchesResult).toMatchObject({
        height: {
          unit: 'inches',
          value: 68.9,
        },
      });
    });

    it('should use default timestamps when not provided', () => {
      const result = serializeWriteOptions(HealthLinkDataType.Steps, {
        value: 1000,
        startDate: undefined,
        endDate: undefined,
      } as any);

      expect(result).toHaveProperty('startTime');
      expect(result).toHaveProperty('endTime');
      expect(typeof (result as any).startTime).toBe('string');
      expect(typeof (result as any).endTime).toBe('string');
    });

    it('should return null for unsupported data types', () => {
      const result = serializeWriteOptions('UnsupportedType' as any, {
        value: 100,
      });

      expect(result).toBeNull();
    });
  });

  describe('Blood Glucose Metadata', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('should handle default metadata values', () => {
      const result = serializeWriteOptions(HealthLinkDataType.BloodGlucose, {
        value: 100,
        unit: BloodGlucoseUnit.MgPerdL,
        time: '2023-01-01T10:00:00.000Z',
      });

      expect(result).toMatchObject({
        relationToMeal: 0,
        mealType: 0,
        specimenSource: 0,
      });
    });

    it('should handle partial metadata', () => {
      const result = serializeWriteOptions(HealthLinkDataType.BloodGlucose, {
        value: 100,
        unit: BloodGlucoseUnit.MgPerdL,
        time: '2023-01-01T10:00:00.000Z',
        metadata: {
          relationToMeal: 2,
        },
      });

      expect(result).toMatchObject({
        relationToMeal: 2,
        mealType: 0,
        specimenSource: 0,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero values', () => {
      Platform.OS = 'android';

      const result = serializeWriteOptions(HealthLinkDataType.Steps, {
        value: 0,
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-01T23:59:59.000Z',
      } as any);

      expect(result).toMatchObject({
        count: 0,
      });
    });

    it('should handle missing values with defaults', () => {
      Platform.OS = 'android';

      const result = serializeWriteOptions(HealthLinkDataType.Steps, {
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-01T23:59:59.000Z',
      } as any);

      expect(result).toMatchObject({
        count: 0,
      });
    });

    it('should return null for non-mobile platforms', () => {
      Platform.OS = 'web' as any;

      const result = serializeWriteOptions(HealthLinkDataType.Steps, {
        value: 1000,
        startDate: '2023-01-01T00:00:00.000Z',
        endDate: '2023-01-01T23:59:59.000Z',
      } as any);

      expect(result).toBeNull();
    });
  });

  describe('Time Handling', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    it('should use provided timestamps', () => {
      const customStart = '2023-01-01T08:00:00.000Z';
      const customEnd = '2023-01-01T18:00:00.000Z';

      const result = serializeWriteOptions(HealthLinkDataType.Steps, {
        value: 1000,
        startDate: customStart,
        endDate: customEnd,
      });

      expect(result).toMatchObject({
        startTime: customStart,
        endTime: customEnd,
      });
    });

    it('should use specific time field when provided', () => {
      const specificTime = '2023-01-01T10:30:00.000Z';

      const result = serializeWriteOptions(HealthLinkDataType.BloodGlucose, {
        value: 100,
        unit: BloodGlucoseUnit.MgPerdL,
        time: specificTime,
      });

      expect(result).toMatchObject({
        time: specificTime,
      });
    });
  });
});
