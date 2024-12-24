import { Platform } from 'react-native';
import {
  initialize,
  // readRecords,
  requestPermission,
} from 'react-native-health-connect';

import {
  genericToAndroidPermissions,
  genericToIosPermissions,
  type HealthPermissions,
} from './types/permissions';

const AppleHealthKit = require('react-native-health');

export const useHealth = () => {
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
