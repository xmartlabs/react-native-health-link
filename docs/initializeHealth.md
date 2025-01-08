# `initializeHealth` Function

The `initializeHealth` function sets up health integration for the application by requesting necessary permissions based on the platform (iOS or Android).

It accepts a `permissions` object with keys `read` and `write`. Use the `HealthLinkPermissions` enum to add permissions to the arrays.

Write method does not support `BloodPressure`, `RestingHeartRate` and `OxygenSaturation`, so I'd recommend not to ask for write permissions for those data types.

---

## **Example Usage**

```typescript
const permissions = {
  read: [HealthLinkPermissions.StepCount, HealthLinkPermissions.HeartRate],
  write: [HealthLinkPermissions.StepCount],
};
await initializeHealth(permissions);
```
