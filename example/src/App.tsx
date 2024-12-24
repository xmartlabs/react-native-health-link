import { View, StyleSheet, Text } from 'react-native';
import { useHealth } from '../../src/useHealth';
import { useEffect } from 'react';
import { HealthLinkPermissions } from '../../src/types/permissions';

export default function App() {
  const { initializeHealth } = useHealth();
  useEffect(() => {
    initializeHealth({
      read: [HealthLinkPermissions.BloodGlucose],
      write: [HealthLinkPermissions.BloodGlucose],
    });
  });
  return (
    <View style={styles.container}>
      <Text>Your blood glucose is</Text>
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
