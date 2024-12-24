import AppleHealthKit, {
  type HealthKitPermissions,
  HealthPermission as AppleHealthPermission,
} from 'react-native-health';
import type { Permission as AndroidHealthPermission } from 'react-native-health-connect';

export type HealthPermissions = {
  read: HealthLinkPermissions[];
  write: HealthLinkPermissions[];
};

export enum HealthLinkPermissions {
  BloodGlucose = 'BloodGlucose',
  Height = 'Height',
  Weight = 'Weight',
  LeanBodyMass = 'LeanBodyMass',
  HeartRate = 'HeartRate',
  RestingHeartRate = 'RestingHeartRate',
}

export const genericToIosPermissions = (
  permissions: HealthPermissions
): HealthKitPermissions => {
  const readPermissions = permissions.read.reduce<AppleHealthPermission[]>(
    (acc, permission) => {
      if (genericToIosMap[permission]) {
        acc.push(genericToIosMap[permission] as AppleHealthPermission);
      }
      return acc;
    },
    []
  );

  const writePermissions = permissions.write.reduce<AppleHealthPermission[]>(
    (acc, permission) => {
      if (genericToIosMap[permission]) {
        acc.push(genericToIosMap[permission] as AppleHealthPermission);
      }
      return acc;
    },
    []
  );
  return {
    permissions: {
      read: readPermissions.flat(),
      write: writePermissions.flat(),
    },
  };
};

export const genericToAndroidPermissions = (
  permissions: HealthPermissions
): AndroidHealthPermission[] => {
  let androidPermissions: AndroidHealthPermission[] = [];
  permissions.read.forEach((permission) => {
    if (genericToAndroidMap[permission]) {
      androidPermissions.push({
        accessType: 'read',
        recordType: genericToAndroidMap[permission],
      });
    }
  });
  permissions.write.forEach((permission) => {
    if (genericToAndroidMap[permission]) {
      androidPermissions.push({
        accessType: 'write',
        recordType: genericToAndroidMap[permission],
      });
    }
  });
  return androidPermissions;
};

const genericToIosMap: { [key: string]: string } = {
  [HealthLinkPermissions.BloodGlucose]:
    AppleHealthKit.Constants.Permissions.BloodGlucose,
  [HealthLinkPermissions.Height]: AppleHealthKit.Constants.Permissions.Height,
  [HealthLinkPermissions.Weight]: AppleHealthKit.Constants.Permissions.Weight,
  [HealthLinkPermissions.LeanBodyMass]:
    AppleHealthKit.Constants.Permissions.LeanBodyMass,
  [HealthLinkPermissions.HeartRate]:
    AppleHealthKit.Constants.Permissions.HeartRate,
  [HealthLinkPermissions.RestingHeartRate]:
    AppleHealthKit.Constants.Permissions.RestingHeartRate,
};

const genericToAndroidMap: {
  [key in HealthLinkPermissions]: AndroidHealthPermission['recordType'];
} = {
  [HealthLinkPermissions.BloodGlucose]: 'BloodGlucose',
  [HealthLinkPermissions.Height]: 'Height',
  [HealthLinkPermissions.Weight]: 'Weight',
  [HealthLinkPermissions.LeanBodyMass]: 'LeanBodyMass',
  [HealthLinkPermissions.HeartRate]: 'HeartRate',
  [HealthLinkPermissions.RestingHeartRate]: 'RestingHeartRate',
};
