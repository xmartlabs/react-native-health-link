import { Platform } from 'react-native';
import {
  getSdkStatus,
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
  SdkAvailabilityStatus,
  type HealthConnectRecord,
  type ReadRecordsResult,
} from 'react-native-health-connect';

import { type HealthPermissions } from './types/permissions';
import {
  HealthLinkDataType,
  optionsToAndroidOptions,
  type ReadOptions,
} from './types/dataTypes';
import type { HealthValue } from 'react-native-health';
import { type HealthLinkDataValue } from './types/results';
import { type WriteDataType, type WriteOptions } from './types/save';
import { serializeWriteOptions, writeIosCallback } from './helpers/save';
import { readDataResultDeserializer, readIosCallback } from './helpers/results';
import {
  genericToAndroidPermissions,
  genericToIosPermissions,
} from './helpers/permissions';

const AppleHealthKit = require('react-native-health');

/**
 * Initializes the health integration for the application by requesting the necessary permissions
 * based on the platform (iOS or Android).
 *
 * @param {HealthPermissions} permissions - The permissions required for accessing health data.
 *
 * @returns {Promise<void>} A promise that resolves when the initialization and permission request process is complete.
 *
 * @example
 * ```typescript
 * const permissions = {
 *   read: [HealthLinkPermissions.StepCount, HealthLinkPermissions.HeartRate],
 *   write: [HealthLinkPermissions.StepCount]
 * };
 * await initializeHealth(permissions);
 * ```
 */
export const initializeHealth = async (permissions: HealthPermissions) => {
  if (Platform.OS === 'ios') {
    const iosPermissions = genericToIosPermissions(permissions);
    AppleHealthKit.initHealthKit(iosPermissions, (error: string) => {
      console.error(error);
    });
  } else if (Platform.OS === 'android') {
    const androidPermissions = genericToAndroidPermissions(permissions);
    await initialize();
    await requestPermission(androidPermissions);
  }
};

/**
 * Checks the availability of the SDK on the current platform.
 *
 * On Android, it checks the SDK status and resolves to `true` if the SDK is available,
 * otherwise logs the reason for unavailability and resolves to `false`.
 *
 * On iOS, it uses AppleHealthKit to check availability and resolves to the result.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the SDK is available, otherwise `false`.
 *
 * @example
 * isAvailable().then((available) => {
 *   if (available) {
 *     console.log('SDK is available');
 *   } else {
 *     console.log('SDK is not available');
 *   }
 * }).catch((error) => {
 *   console.error('Error checking SDK availability:', error);
 * });
 */
export const isAvailable = () => {
  return new Promise(async (resolve, reject) => {
    if (Platform.OS === 'android') {
      const status = await getSdkStatus();
      if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
        resolve(true);
      } else {
        if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
          console.log('SDK is not available');
        }
        if (
          status ===
          SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
        ) {
          console.log('SDK is not available, provider update required');
        }
        resolve(false);
      }
    } else if (Platform.OS === 'ios') {
      AppleHealthKit.isAvailable((err: Object, available: boolean) => {
        if (err) {
          console.error('Error checking availability: ', err);
          reject(err);
        } else {
          resolve(available);
        }
      });
    }
  });
};

/**
 * Reads health data of the specified type from the device.
 *
 * @param {T} dataType - The type of health data to read. Use the `HealthLinkDataType` enum.
 * @param {ReadOptions} options - The options for reading the health data.
 * @returns {Promise<Array<HealthLinkDataValue<T>>>} A promise that resolves to an array of health data values.
 */
export const read = async <T extends HealthLinkDataType>(
  dataType: T,
  options: ReadOptions
): Promise<Array<HealthLinkDataValue<T>>> => {
  let data: ReadRecordsResult<T> | HealthValue[] = [];
  if (Platform.OS === 'ios') {
    data = (await readIosCallback(dataType, options)) as HealthValue[];
  } else if (Platform.OS === 'android') {
    data = await readRecords(dataType, optionsToAndroidOptions(options));
  }
  return readDataResultDeserializer(dataType, options, data);
};

/**
 * Writes health data to the appropriate platform's health store.
 *
 * @param {T} dataType - The type of data to be written, extending WriteDataType.
 * @param {WriteOptions<T>} data - The data to be written.
 * @returns {Promise<void>} A promise that resolves when the data has been written.
 *
 * @example
 * ```typescript
 * const dataType = 'heartRate';
 * const data = { value: 72, timestamp: new Date() };
 * await write(dataType, data);
 * ```
 */
export const write = async <T extends WriteDataType>(
  dataType: T,
  data: WriteOptions<T>
): Promise<void> => {
  const serializedData = serializeWriteOptions(dataType, data);
  if (serializedData === null) {
    return;
  }
  if (Platform.OS === 'ios') {
    await writeIosCallback(dataType, serializedData as WriteOptions<T>);
  } else if (Platform.OS === 'android') {
    await insertRecords([serializedData as HealthConnectRecord]).catch((e) => {
      console.error(e);
    });
  }
};

export * from './types/units';
export * from './types/dataTypes';
export * from './types/save';
export * from './types/permissions';
