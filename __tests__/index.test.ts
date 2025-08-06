import { Platform } from 'react-native';
import { initializeHealth, isAvailable, read, write } from '../src/index';
import { HealthLinkDataType } from '../src/types/dataTypes';
import { HealthLinkPermissions } from '../src/types/permissions';

jest.mock('react-native-health-connect');
jest.mock('react-native-health');

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('react-native-health-link', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initializeHealth', () => {
    it('should initialize health for iOS', async () => {
      const AppleHealthKit = require('react-native-health');
      Platform.OS = 'ios';

      const permissions = {
        read: [HealthLinkPermissions.Steps],
        write: [HealthLinkPermissions.Steps],
      };

      await initializeHealth(permissions);

      expect(AppleHealthKit.initHealthKit).toHaveBeenCalledWith(
        expect.objectContaining({
          permissions: expect.any(Object),
        })
      );
    });

    it('should initialize health for Android', async () => {
      const {
        initialize,
        requestPermission,
      } = require('react-native-health-connect');
      Platform.OS = 'android';

      const permissions = {
        read: [HealthLinkPermissions.Steps],
        write: [HealthLinkPermissions.Steps],
      };

      await initializeHealth(permissions);

      expect(initialize).toHaveBeenCalled();
      expect(requestPermission).toHaveBeenCalled();
    });
  });

  describe('isAvailable', () => {
    it('should check availability on iOS', async () => {
      const AppleHealthKit = require('react-native-health');
      Platform.OS = 'ios';

      AppleHealthKit.isAvailable.mockImplementation(
        (callback: (err: any, available: boolean) => void) => {
          callback(null, true);
        }
      );

      const result = await isAvailable();

      expect(result).toBe(true);
      expect(AppleHealthKit.isAvailable).toHaveBeenCalled();
    });

    it('should handle iOS availability error', async () => {
      const AppleHealthKit = require('react-native-health');
      Platform.OS = 'ios';

      AppleHealthKit.isAvailable.mockImplementation(
        (callback: (err: any, available: boolean) => void) => {
          callback(new Error('Test error'), false);
        }
      );

      await expect(isAvailable()).rejects.toThrow('Test error');
    });

    it('should check availability on Android when SDK is available', async () => {
      const {
        getSdkStatus,
        SdkAvailabilityStatus,
      } = require('react-native-health-connect');
      Platform.OS = 'android';

      getSdkStatus.mockResolvedValue(SdkAvailabilityStatus.SDK_AVAILABLE);

      const result = await isAvailable();

      expect(result).toBe(true);
      expect(getSdkStatus).toHaveBeenCalled();
    });

    it('should return false on Android when SDK is unavailable', async () => {
      const {
        getSdkStatus,
        SdkAvailabilityStatus,
      } = require('react-native-health-connect');
      Platform.OS = 'android';

      getSdkStatus.mockResolvedValue(SdkAvailabilityStatus.SDK_UNAVAILABLE);

      const result = await isAvailable();

      expect(result).toBe(false);
      expect(getSdkStatus).toHaveBeenCalled();
    });

    it('should return false on Android when provider update required', async () => {
      const {
        getSdkStatus,
        SdkAvailabilityStatus,
      } = require('react-native-health-connect');
      Platform.OS = 'android';

      getSdkStatus.mockResolvedValue(
        SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
      );

      const result = await isAvailable();

      expect(result).toBe(false);
      expect(getSdkStatus).toHaveBeenCalled();
    });
  });

  describe('read', () => {
    it('should read data on iOS', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      const options = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      };

      AppleHealthKit.getDailyStepCountSamples.mockImplementation(
        (_options: any, callback: any) => {
          callback(null, [
            { value: 1000, startDate: '2023-01-01', endDate: '2023-01-01' },
          ]);
        }
      );

      const result = await read(HealthLinkDataType.Steps, options);

      expect(Array.isArray(result)).toBe(true);
    });

    it('should read data on Android', async () => {
      const { readRecords } = require('react-native-health-connect');
      Platform.OS = 'android';

      readRecords.mockResolvedValue({ records: [] });

      const options = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      };

      const result = await read(HealthLinkDataType.Steps, options);

      expect(Array.isArray(result)).toBe(true);
      expect(readRecords).toHaveBeenCalled();
    });

    it('should handle different data types', async () => {
      Platform.OS = 'android';
      const { readRecords } = require('react-native-health-connect');

      readRecords.mockResolvedValue({ records: [] });

      const options = {
        startDate: '2023-01-01',
        endDate: '2023-01-02',
      };

      const dataTypes = [
        HealthLinkDataType.Steps,
        HealthLinkDataType.HeartRate,
        HealthLinkDataType.Weight,
        HealthLinkDataType.Height,
      ];

      for (const dataType of dataTypes) {
        const result = await read(dataType, options);
        expect(Array.isArray(result)).toBe(true);
      }
    });
  });

  describe('write', () => {
    it('should write data on iOS', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      const data = {
        value: 1000,
        startDate: '2023-01-01',
        endDate: '2023-01-01',
      };

      AppleHealthKit.saveSteps.mockImplementation(
        (_data: any, callback: any) => {
          callback(null, true);
        }
      );

      await expect(
        write(HealthLinkDataType.Steps, data)
      ).resolves.toBeUndefined();
    });

    it('should write data on Android', async () => {
      const { insertRecords } = require('react-native-health-connect');
      Platform.OS = 'android';

      insertRecords.mockResolvedValue(undefined);

      const data = {
        value: 1000,
        startDate: '2023-01-01',
        endDate: '2023-01-01',
      };

      await expect(
        write(HealthLinkDataType.Steps, data)
      ).resolves.toBeUndefined();
    });

    it('should handle serialization returning null', async () => {
      Platform.OS = 'ios';

      const data = {
        value: 1000,
        startDate: '2023-01-01',
        endDate: '2023-01-01',
      };

      await expect(
        write(HealthLinkDataType.Steps, data)
      ).resolves.toBeUndefined();
    });

    it('should handle Android write errors gracefully', async () => {
      const { insertRecords } = require('react-native-health-connect');
      Platform.OS = 'android';

      insertRecords.mockRejectedValue(new Error('Insert failed'));

      const data = {
        value: 1000,
        startDate: '2023-01-01',
        endDate: '2023-01-01',
      };

      await expect(
        write(HealthLinkDataType.Steps, data)
      ).resolves.toBeUndefined();
    });
  });

  describe('permissions', () => {
    it('should handle complex permission combinations', async () => {
      Platform.OS = 'ios';
      const AppleHealthKit = require('react-native-health');

      const permissions = {
        read: [
          HealthLinkPermissions.Steps,
          HealthLinkPermissions.HeartRate,
          HealthLinkPermissions.BloodPressure,
        ],
        write: [HealthLinkPermissions.Steps, HealthLinkPermissions.Weight],
      };

      await initializeHealth(permissions);

      expect(AppleHealthKit.initHealthKit).toHaveBeenCalledWith(
        expect.objectContaining({
          permissions: expect.objectContaining({
            read: expect.any(Array),
            write: expect.any(Array),
          }),
        })
      );
    });
  });
});
