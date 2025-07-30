import { HealthUnit } from 'react-native-health';
import type { RecordResult } from 'react-native-health-connect';

export enum BloodGlucoseUnit {
  MgPerdL = 'mgPerdL',
  MmolPerL = 'mmolPerL',
}

export enum WeightUnit {
  Pounds = 'pounds',
  Kg = 'kg',
  Gram = 'gram',
}

export enum HeighUnit {
  Inch = 'inch',
  Cm = 'cm',
  Meter = 'meter',
  Foot = 'foot',
}

export enum StepsUnit {
  Count = 'count',
}

export enum HeartRateUnit {
  Bpm = 'bpm',
}

export enum EnergyUnit {
  Calories = 'calories',
  Joules = 'joules',
  Kilojoules = 'kilojoules',
}

export const androidHeightUnitMap = (
  data: RecordResult<'Height'>,
  unit?: string
) => {
  switch (unit) {
    case HeighUnit.Cm:
      return data.height.inMeters * 100;
    case HeighUnit.Meter:
      return data.height.inMeters;
    case HeighUnit.Foot:
      return data.height.inFeet;
    case HeighUnit.Inch:
      return data.height.inInches;
    default:
      return data.height.inInches;
  }
};

export const androidWeightUnitMap = (
  data: RecordResult<'Weight'>,
  unit?: string
) => {
  switch (unit) {
    case WeightUnit.Kg:
      return data.weight.inKilograms;
    case WeightUnit.Gram:
      return data.weight.inGrams;
    case WeightUnit.Pounds:
      return data.weight.inPounds;
    default:
      return data.weight.inPounds;
  }
};

export const androidBloodGlucoseUnitMap = {
  [BloodGlucoseUnit.MgPerdL]: 'milligramsPerDeciliter',
  [BloodGlucoseUnit.MmolPerL]: 'millimolesPerLiter',
};

export const androidActiveEnergyUnitMap = (
  data: RecordResult<'ActiveCaloriesBurned'>,
  unit?: string
) => {
  switch (unit) {
    case EnergyUnit.Calories:
      return data.energy.inCalories;
    case EnergyUnit.Joules:
      return data.energy.inJoules;
    case EnergyUnit.Kilojoules:
      return data.energy.inKilojoules;
    default:
      return data.energy.inCalories;
  }
};

export const androidBasalEnergyUnitMap = (
  data: RecordResult<'BasalMetabolicRate'>,
  unit?: string
) => {
  switch (unit) {
    case EnergyUnit.Calories:
      return data.basalMetabolicRate.inKilocaloriesPerDay;
    case EnergyUnit.Kilojoules:
      return data.basalMetabolicRate.inWatts * 86.4; // Convert watts to kJ/day (1 watt = 86.4 kJ/day)
    case EnergyUnit.Joules:
      return data.basalMetabolicRate.inWatts * 86400; // Convert watts to J/day (1 watt = 86400 J/day)
    default:
      return data.basalMetabolicRate.inKilocaloriesPerDay;
  }
};

export const unitToIosUnitMap = {
  [HeighUnit.Meter]: HealthUnit?.meter,
  [HeighUnit.Foot]: HealthUnit?.foot,
  [HeighUnit.Inch]: HealthUnit?.inch,
  [WeightUnit.Gram]: HealthUnit?.gram,
  [WeightUnit.Pounds]: HealthUnit?.pound,
  [StepsUnit.Count]: HealthUnit?.count,
  [BloodGlucoseUnit.MgPerdL]: HealthUnit?.mgPerdL,
  [BloodGlucoseUnit.MmolPerL]: HealthUnit?.mmolPerL,
  [HeighUnit.Cm]: HealthUnit?.meter,
  [WeightUnit.Kg]: HealthUnit?.gram,
  [HeartRateUnit.Bpm]: HealthUnit?.bpm,
  [EnergyUnit.Calories]: HealthUnit?.calorie,
  [EnergyUnit.Joules]: HealthUnit?.joule,
  [EnergyUnit.Kilojoules]: HealthUnit?.kilocalorie,
};
