import { Platform } from 'react-native';
import {
  initialize,
  insertRecords,
  readRecords,
  requestPermission,
  type HealthConnectRecord,
  type ReadRecordsResult,
} from 'react-native-health-connect';

import {
  genericToAndroidPermissions,
  genericToIosPermissions,
  type HealthPermissions,
} from './types/permissions';
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

const AppleHealthKit = require('react-native-health');

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
