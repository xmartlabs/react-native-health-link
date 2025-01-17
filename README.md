# react-native-health-link

> [!WARNING]
> This module is currently in **alpha**. While it provides core functionality, it is still under active development and may contain bugs.

A simple way to work with HealthKit on iOS and Health Connect on Android in React Native. Access health data like steps, sleep, and more with one interface that unifies react-native-health and react-native-health-connect.

## Installation

To install and setup this package, please refer to the [installation guide](./docs/installation.md).

## Usage

```jsx
import { useState } from 'react';
import { Text } from 'react-native';
import {
  initializeHealth,
  HealthLinkDataType,
  HealthLinkPermissions,
  read,
} from 'react-native-health-link';

initializeHealth({
  read: [HealthLinkPermissions.BloodGlucose],
  write: [HealthLinkPermissions.BloodGlucose],
});

export default function App() {
  const [bloodGlucose, setBloodGlucose] = useState<number | undefined>();

  read(HealthLinkDataType.BloodGlucose, {
    startDate: new Date('2025-01-01').toISOString(),
  }).then((data) => {
    setBloodGlucose(data[0]?.value);
  });
  return <Text>Your blood glucose is {bloodGlucose} </Text>;
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

This library provides a common interface to simplify cross-platform use of health tools; most of the credit goes to [react-native-health](https://github.com/agencyenterprise/react-native-health?tab=readme-ov-file) and [react-native-health-connect](https://github.com/matinzd/react-native-health-connect).

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/53fab07a-54f5-4f46-a894-e3476318a68d" alt="Xmartlabs Logo" width="150" />
</p>

<p align="center">
  <b>Created with ❤️ by <a href="https://xmartlabs.com/">Xmartlabs</a></b>
</p>




