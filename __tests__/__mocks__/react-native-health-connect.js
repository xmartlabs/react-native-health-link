module.exports = {
  getSdkStatus: jest.fn().mockResolvedValue('SDK_AVAILABLE'),
  initialize: jest.fn().mockResolvedValue(undefined),
  requestPermission: jest.fn().mockResolvedValue(['granted']),

  readRecords: jest.fn().mockResolvedValue({ records: [] }),
  insertRecords: jest.fn().mockResolvedValue(undefined),

  SdkAvailabilityStatus: {
    SDK_AVAILABLE: 'SDK_AVAILABLE',
    SDK_UNAVAILABLE: 'SDK_UNAVAILABLE',
    SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED:
      'SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED',
  },

  RecordType: {
    BloodGlucose: 'BloodGlucose',
    Height: 'Height',
    Weight: 'Weight',
    HeartRate: 'HeartRate',
    RestingHeartRate: 'RestingHeartRate',
    BloodPressure: 'BloodPressure',
    OxygenSaturation: 'OxygenSaturation',
    Steps: 'Steps',
    ActiveCaloriesBurned: 'ActiveCaloriesBurned',
    BasalMetabolicRate: 'BasalMetabolicRate',
  },
};
