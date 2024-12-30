import { Platform } from 'react-native';
import {
  initialize,
  readRecords,
  requestPermission,
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
import {
  readDataResultDeserializer,
  readIosCallback,
  type HealthLinkDataValue,
} from './types/results';

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
