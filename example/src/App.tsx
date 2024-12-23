import { View, StyleSheet } from 'react-native';
import { useHealth } from '../../src/useHealth';

// const result = multiply(3, 7);

export default function App() {
  useHealth();
  return (
    <View style={styles.container}>{/* <Text>Result: {result}</Text> */}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
