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
};
