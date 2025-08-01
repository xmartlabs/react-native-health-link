# react-native-health-link

> [!WARNING]
> This module is currently in **alpha**. While it provides core functionality, it is still under active development and may contain bugs.

A simple way to work with HealthKit on iOS and Health Connect on Android in React Native. Access health data like blood glucose, weight, height, heart rate, resting heart rate, blood pressure, oxygen saturation, steps, and more with one interface that unifies @kingstinct/react-native-healthkit and react-native-health-connect.

## Installation

To install and setup this package, please refer to the [installation guide](./docs/installation.md).

## Supported Health Data Types

This library supports reading and writing the following health data types:

### Read & Write Support

- **Blood glucose** - Blood glucose levels with support for mg/dL and mmol/L units
- **Weight** - Body weight with support for kg, grams, and pounds
- **Height** - Body height with support for cm, meters, feet, and inches
- **Heart rate** - Heart rate measurements in beats per minute
- **Steps** - Daily step count

### Read Only Support

- **Resting heart rate** - Resting heart rate measurements
- **Blood pressure** - Systolic and diastolic blood pressure readings
- **Oxygen saturation** - Blood oxygen saturation percentage

## Usage

```jsx
import { useState } from 'react';
import { Text } from 'react-native';
import {
  initializeHealth,
  HealthLinkDataType,
  HealthLinkPermissions,
  read,
  write,
  BloodGlucoseUnit,
  WeightUnit,
  HeighUnit
} from 'react-native-health-link';

initializeHealth({
  read: [HealthLinkPermissions.BloodGlucose],
  write: [HealthLinkPermissions.BloodGlucose],
});

export default function App() {
  const [bloodGlucose, setBloodGlucose] = useState<number | undefined>();
  const [weight, setWeight] = useState<number | undefined>();

  // Reading health data
  read(HealthLinkDataType.BloodGlucose, {
    unit: BloodGlucoseUnit.MmolPerL,
    startDate: new Date('2025-01-01').toISOString(),
  }).then((data) => {
    setBloodGlucose(data[0]?.value);
  });

  read(HealthLinkDataType.Weight, {
    unit: WeightUnit.Kg,
    startDate: new Date('2025-01-01').toISOString(),
  }).then((data) => {
    setWeight(data[0]?.value);
  });

  write(HealthLinkDataType.BloodGlucose, {
    value: 4.5,
    unit: BloodGlucoseUnit.MmolPerL,
  });

  write(HealthLinkDataType.Height, {
    value: 175,
    unit: HeighUnit.Cm,
  });

  return (
    <>
      <Text>Your blood glucose is {bloodGlucose} mmol/L</Text>
      <Text>Your weight is {weight} kg</Text>
    </>
  );
}
```

### Documentation

#### SDK functions:

[initializeHealth](./docs/initializeHealth.md)

[isAvailable](./docs/isAvailable.md)

#### Data functions:

[read](./docs/read.md)

[write](./docs/write.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Acknowledgements

This library provides a common interface to simplify cross-platform use of health tools; most of the credit goes to [@kingstinct/react-native-healthkit](https://github.com/kingstinct/react-native-healthkit) and [react-native-health-connect](https://github.com/matinzd/react-native-health-connect).

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/53fab07a-54f5-4f46-a894-e3476318a68d" alt="Xmartlabs Logo" width="150" />
</p>

<p align="center">
  <b>Created with ❤️ by <a href="https://xmartlabs.com/">Xmartlabs</a></b>
</p>
