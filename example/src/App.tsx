import { View, StyleSheet, Text } from 'react-native';
import { read, useHealth } from '../../src/useHealth';
import { useEffect, useState } from 'react';
import { HealthLinkPermissions } from '../../src/types/permissions';
import { HealthLinkDataType } from '../../src/types/dataTypes';

export default function App() {
  const [bloodGlucose, setBloodGlucose] = useState<number | null>(null);
  const { initializeHealth } = useHealth();
  console.log(bloodGlucose);
  useEffect(() => {
    initializeHealth({
      read: [HealthLinkPermissions.BloodGlucose],
      write: [HealthLinkPermissions.BloodGlucose],
    }).then(() => {
      read(HealthLinkDataType.BloodGlucose, {
        unit: 'mg/dL',
        startDate: new Date('2021-01-01').toISOString(),
      }).then((data) => {
        setBloodGlucose(data);
      });
    });
  });
  return (
    <View style={styles.container}>
      <Text>
        Your blood glucose is{' '}
        {bloodGlucose?.records[0].level.inMillimolesPerLiter}
      </Text>
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
