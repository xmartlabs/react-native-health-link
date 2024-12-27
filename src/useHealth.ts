import { Platform } from 'react-native';
import {
  initialize,
  readRecords,
  // readRecords,
  requestPermission,
  type ReadRecordsOptions,
} from 'react-native-health-connect';

import {
  genericToAndroidPermissions,
  genericToIosPermissions,
  type HealthPermissions,
} from './types/permissions';
import type { HealthLinkDataType } from './types/dataTypes';
import { BloodGlucoseUnit } from './types/units';

const AppleHealthKit = require('react-native-health');

type TimeOperator = 'after' | 'before' | 'between';

const dataValueToIosReadFunction = (dataType: HealthLinkDataType) => {
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

interface ReadOptions {
  startDate?: string;
  endDate?: string;
  ascending?: boolean;
  limit?: number;
  unit?: string;
}

const optionsToAndroidOptions = (options: ReadOptions): ReadRecordsOptions => {
  let operator: TimeOperator = 'before';
  if (options.startDate && options.endDate) {
    operator = 'between';
  } else if (options.startDate) {
    operator = 'after';
  }

  return {
    timeRangeFilter: {
      operator,
      startTime: options.startDate!,
      endTime: options.endDate!,
    },
    ascendingOrder: options.ascending,
    pageSize: options.limit,
  };
};

const initializeHealth = async (permissions: HealthPermissions) => {
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

const readDataResultDeserializer = (
  dataType: HealthLinkDataType,
  options: ReadOptions
) => {
  if (Platform.OS === 'ios') {
    return (data: any) => {
      switch (dataType) {
        case 'BloodGlucose':
          return data[0]?.value;
        case 'Height':
          return data[0]?.value;
        case 'Weight':
          return data[0]?.value;
        case 'LeanBodyMass':
          return data[0]?.value;
        case 'HeartRate':
          return data[0]?.value;
        case 'RestingHeartRate':
          return data[0]?.value;
        default:
          return data;
      }
    };
  } else if (Platform.OS === 'android') {
    return (data: any) => {
      switch (dataType) {
        case 'BloodGlucose':
          if (options.unit === BloodGlucoseUnit.MmolPerL) {
            return data[0]?.level?.inMillimolesPerLiter;
          } else {
            return data[0]?.level?.inMilligramsPerDeciliter;
          }
        case 'Height':
          return data[0]?.height?.inMeters;
        case 'Weight':
          return data[0]?.weight?.inKilograms;
      }
    };
  }
};

export const read = async (
  dataType: HealthLinkDataType,
  options: {
    unit?: string;
    startDate?: string;
    endDate?: string;
    ascending?: boolean;
    limit?: number;
  }
) => {
  if (Platform.OS === 'ios') {
    return dataValueToIosReadFunction(dataType)(options);
  } else if (Platform.OS === 'android') {
    return readRecords(dataType, optionsToAndroidOptions(options));
  }
};

export const useHealth = () => {
  const readBloodGlucose = async () => {
    //set up the time range for the query
    const dayStart = new Date();
    const dayEnd = new Date();
    dayStart.setHours(0, 0, 0, 405);
    dayEnd.setHours(23, 59, 15, 405);

    if (Platform.OS === 'ios') {
      AppleHealthKit.getBloodGlucoseSamples(
        {
          startDate: dayStart.toISOString(),
          endDate: dayEnd.toISOString(),
          ascending: false,
        }
        // (err, results) => {
        //   if (err) {
        //     console.error(err);
        //     return;
        //   }
        //   // setGlucose(results[0]?.value);
        //   //this will return the last result
        //   return results[0]?.value;
        // }
      );
    } else if (Platform.OS === 'android') {
      // const results = await readRecords('BloodGlucose', {
      //   timeRangeFilter: {
      //     operator: 'between',
      //     startTime: dayStart.toISOString(),
      //     endTime: dayEnd.toISOString(),
      //   },
      //   ascendingOrder: false,
      // });
      // setGlucose(results[0]?.level?.inMillimolesPerLiter);
      //this will return the last result
      // return results[0]?.level?.inMillimolesPerLiter;
    }
  };

  return {
    readBloodGlucose,
    initializeHealth,
  };
};
