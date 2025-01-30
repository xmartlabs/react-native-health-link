export type HealthPermissions = {
  read: HealthLinkPermissions[];
  write: HealthLinkPermissions[];
};

export enum HealthLinkPermissions {
  BloodGlucose = 'BloodGlucose',
  Height = 'Height',
  Weight = 'Weight',
  HeartRate = 'HeartRate',
  RestingHeartRate = 'RestingHeartRate',
  BloodPressure = 'BloodPressure',
  OxygenSaturation = 'OxygenSaturation',
  Steps = 'Steps',
}
