const mockCallback = (callback) => {
  if (typeof callback === 'function') {
    callback(null, []);
  }
};

const mockFunctionWithCallback = jest.fn().mockImplementation(mockCallback);

module.exports = {
  initHealthKit: jest.fn().mockImplementation((options, callback) => {
    if (typeof callback === 'function') {
      callback(null, true);
    }
  }),

  isAvailable: jest.fn().mockImplementation((callback) => {
    callback(null, true);
  }),

  getBloodGlucoseSamples: mockFunctionWithCallback,
  getHeightSamples: mockFunctionWithCallback,
  getWeightSamples: mockFunctionWithCallback,
  getHeartRateSamples: mockFunctionWithCallback,
  getRestingHeartRateSamples: mockFunctionWithCallback,
  getOxygenSaturationSamples: mockFunctionWithCallback,
  getBloodPressureSamples: mockFunctionWithCallback,
  getDailyStepCountSamples: mockFunctionWithCallback,
  getActiveEnergyBurned: mockFunctionWithCallback,
  getBasalEnergyBurned: mockFunctionWithCallback,

  saveBloodGlucoseSample: jest.fn().mockImplementation((data, callback) => {
    if (typeof callback === 'function') {
      callback(null, true);
    }
  }),
  saveHeight: jest.fn().mockImplementation((data, callback) => {
    if (typeof callback === 'function') {
      callback(null, true);
    }
  }),
  saveWeight: jest.fn().mockImplementation((data, callback) => {
    if (typeof callback === 'function') {
      callback(null, true);
    }
  }),
  saveHeartRateSample: jest.fn().mockImplementation((data, callback) => {
    if (typeof callback === 'function') {
      callback(null, true);
    }
  }),
  saveSteps: jest.fn().mockImplementation((data, callback) => {
    if (typeof callback === 'function') {
      callback(null, true);
    }
  }),

  Constants: {
    Permissions: {
      BloodGlucose: 'BloodGlucose',
      Height: 'Height',
      Weight: 'Weight',
      HeartRate: 'HeartRate',
      RestingHeartRate: 'RestingHeartRate',
      BloodPressureDiastolic: 'BloodPressureDiastolic',
      BloodPressureSystolic: 'BloodPressureSystolic',
      OxygenSaturation: 'OxygenSaturation',
      Steps: 'Steps',
      ActiveEnergyBurned: 'ActiveEnergyBurned',
      BasalEnergyBurned: 'BasalEnergyBurned',
    },
    Units: {
      gram: 'gram',
      kilogram: 'kilogram',
      ounce: 'ounce',
      pound: 'pound',
      meter: 'meter',
      inch: 'inch',
      foot: 'foot',
      centimeter: 'centimeter',
      bpm: 'count/min',
      calories: 'kcal',
      count: 'count',
      percent: 'percent',
      mmhg: 'mmHg',
      mmolPerL: 'mmol<180.1558800000541>/L',
      mgPerdL: 'mg/dL',
    },
  },

  getDateOfBirth: mockFunctionWithCallback,
  getBiologicalSex: mockFunctionWithCallback,
  getLatestWeight: mockFunctionWithCallback,
  getLatestHeight: mockFunctionWithCallback,
  getLatestBmi: mockFunctionWithCallback,
};
