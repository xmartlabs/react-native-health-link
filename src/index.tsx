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
import { readDataResultDeserializer, readIosCallback } from './types/results';

const AppleHealthKit = require('react-native-health');

export const initializeHealth = async (permissions: HealthPermissions) => {
  if (Platform.OS === 'ios') {
    const iosPermissions = genericToIosPermissions(permissions);
    AppleHealthKit.initHealthKit(iosPermissions, (error: string) => {
      console.log(error);
    });
  } else if (Platform.OS === 'android') {
    const androidPermissions = genericToAndroidPermissions(permissions);
    await initialize();
    await requestPermission(androidPermissions);
  }
};

export const read = async (
  dataType: HealthLinkDataType,
  options: ReadOptions
) => {
  let data: ReadRecordsResult<any> | HealthValue[] = [];
  if (Platform.OS === 'ios') {
    data = (await readIosCallback(dataType, options)) as HealthValue[];
  } else if (Platform.OS === 'android') {
    data = await readRecords(dataType, optionsToAndroidOptions(options));
  }
  return readDataResultDeserializer(dataType, options, data);
};
