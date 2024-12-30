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
