import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { HealthLinkPermissions } from '../../src/types/permissions';
import { HealthLinkDataType } from '../../src/types/dataTypes';
import { initializeHealth, read, write } from 'react-native-health-link';
import { BloodGlucoseUnit, HeighUnit, WeightUnit } from '../../src/types/units';

export default function App() {
  const [bloodGlucose, setBloodGlucose] = useState<number | undefined>();
  const [weight, setWeight] = useState<number | undefined>();
  const [height, setHeight] = useState<number | undefined>();
  const [heartRate, setHeartRate] = useState<number | undefined>();
  const [restingHeartRate, setRestingHeartRate] = useState<
    number | undefined
  >();
  const [bloodPressure, setBloodPressure] = useState<
    { systolic: number; diastolic: number } | undefined
  >();
  const [oxygenSaturation, setOxygenSaturation] = useState<
    number | undefined
  >();
  const [steps, setSteps] = useState<number | undefined>();

  useEffect(() => {
    initializeHealth({
      read: [
        HealthLinkPermissions.BloodGlucose,
        HealthLinkPermissions.Height,
        HealthLinkPermissions.Weight,
        HealthLinkPermissions.HeartRate,
        HealthLinkPermissions.RestingHeartRate,
        HealthLinkPermissions.BloodPressure,
        HealthLinkPermissions.OxygenSaturation,
        HealthLinkPermissions.Steps,
      ],
      write: [
        HealthLinkPermissions.BloodGlucose,
        HealthLinkPermissions.Height,
        HealthLinkPermissions.Weight,
        HealthLinkPermissions.Steps,
        HealthLinkPermissions.HeartRate,
      ],
    }).then(() => {
      read(HealthLinkDataType.BloodGlucose, {
        unit: BloodGlucoseUnit.MmolPerL,
        startDate: new Date('2021-01-01').toISOString(),
      }).then((data) => {
        setBloodGlucose(data[0]?.value);
      });
      read(HealthLinkDataType.Height, {
        startDate: new Date('2021-01-01').toISOString(),
        unit: HeighUnit.Cm,
      }).then((data) => {
        setHeight(data[0]?.value);
      });
      read(HealthLinkDataType.Weight, {
        startDate: new Date('2021-01-01').toISOString(),
        unit: WeightUnit.Kg,
      }).then((data) => {
        setWeight(data[0]?.value);
      });
      read(HealthLinkDataType.HeartRate, {
        startDate: new Date('2021-01-01').toISOString(),
      }).then((data) => {
        setHeartRate(data[0]?.value);
      });
      read(HealthLinkDataType.RestingHeartRate, {
        startDate: new Date('2024-12-14').toISOString(),
      }).then((data) => {
        setRestingHeartRate(data[0]?.value);
      });
      read(HealthLinkDataType.BloodPressure, {
        startDate: new Date('2021-01-01').toISOString(),
      }).then((data) => {
        setBloodPressure(data[0]?.value);
      });
      read(HealthLinkDataType.OxygenSaturation, {
        startDate: new Date('2021-01-01').toISOString(),
      }).then((data) => {
        setOxygenSaturation(data[0]?.value);
      });
      read(HealthLinkDataType.Steps, {
        startDate: new Date('2024-12-30').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
      }).then((data) => {
        setSteps(data[0]?.value);
      });
      write(HealthLinkDataType.BloodGlucose, {
        value: 5,
      });
      write(HealthLinkDataType.Height, {
        value: 180,
      });
      write(HealthLinkDataType.Weight, {
        value: 80,
      });
      write(HealthLinkDataType.Steps, {
        value: 100,
        startDate: new Date('2024-12-31').toISOString(),
        endDate: new Date('2024-12-31').toISOString(),
      });
      write(HealthLinkDataType.HeartRate, {
        value: 100,
      });
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Your blood glucose is {bloodGlucose}</Text>
      <Text>Your weight is {weight}</Text>
      <Text>Your height is {height}</Text>
      <Text>Your heart rate is {heartRate}</Text>
      <Text>Your resting heart rate is {restingHeartRate}</Text>
      <Text>
        Your blood pressure is {bloodPressure?.systolic}/
        {bloodPressure?.diastolic}
      </Text>
      <Text>Your oxygen saturation is {oxygenSaturation}</Text>
      <Text>Your steps today are {steps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
