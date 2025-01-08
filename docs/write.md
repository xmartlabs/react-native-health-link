# `write` Function

The `write` function writes health-related data to the platform's health store (HealthKit for iOS or Health Connect for Android). It supports various data types and uses platform-specific APIs for data persistence.

---

## **Example usage**

```typescript
read(HealthLinkDataType.BloodGlucose, {
  unit: BloodGlucoseUnit.MmolPerL,
  startDate: new Date('2021-01-01').toISOString(),
});
```

## **Data types**

Type: WriteDataType
Description: The `WriteDataType` type specifies the health data types that can be recorded using the write function.

```
BloodGlucose
Height
Weight
HeartRate
Steps
```

## **Options**

```typescript
export interface ReadOptions {
  startDate?: string;
  endDate?: string;
  ascending?: boolean;
  limit?: number;
  unit?: string;
}
```

## **`WriteOptions` Interface**

The `WriteOptions` interface defines the structure of data that can be written to the health store. It includes base fields for all data types and specific fields for certain types, such as `Steps`. Some platform-specific properties and other misc properties can be recorded using the `metadata` field.

---

### **Table: WriteOptions Fields**

| **Field**   | **Type**                                              | **Description**                                                                                 |
| ----------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `value`     | `number` or `{ diastolic: number; systolic: number }` | The value of the health data. For `BloodPressure`, it requires both `diastolic` and `systolic`. |
| `time`      | `string`                                              | The timestamp of the health data in ISO 8601 format.                                            |
| `unit`      | `Unit`                                                | The unit of measurement (e.g., `BloodGlucoseUnit.MmolPerL`, `WeightUnit.Kg`).                   |
| `metadata`  | `Record<string, any>`                                 | Additional metadata, such as `source` and other custom key-value pairs.                         |
| `startDate` | `string` (required for `Steps`)                       | The start timestamp in ISO 8601 format, applicable to `Steps`. Optional for other data types.   |
| `endDate`   | `string` (required for `Steps`)                       | The end timestamp in ISO 8601 format, applicable to `Steps`. Optional for other data types.     |

---

### **Field Explanations**

1. **`value`**:

   - **Type**:
     - For most data types: `number`.
     - For `BloodPressure`: `{ diastolic: number; systolic: number }`.
   - **Description**: Represents the health data value.
   - **Example**:
     - `value: 72` for `HeartRate`.
     - `value: { diastolic: 80, systolic: 120 }` for `BloodPressure`.

2. **`time`**:

   - **Type**: `string`.
   - **Description**: The timestamp when the health data was recorded.
   - **Example**: `time: "2023-01-01T12:00:00Z"`.

3. **`unit`**:

   - **Type**: `Unit`.
   - **Description**: The unit of measurement for the health data.
   - **Example**: `unit: BloodGlucoseUnit.MmolPerL`.

4. **`metadata`**:

   - **Type**: `Record<string, any>`.
   - **Description**: Additional information about the data entry.
   - **Example**:
     ```json
     {
       "source": "AppName"
     }
     ```

5. **`startDate` and `endDate`**:
   - **Type**: `string` (ISO 8601 format).
   - **Description**:
     - **Required for `Steps`**: Defines the interval for step tracking.
     - **Optional for other data types**: Used to specify time ranges.
   - **Example**:
     ```typescript
     startDate: '2023-01-01T00:00:00Z';
     endDate: '2023-01-01T23:59:59Z';
     ```

---

### **Unit Types**

The `Unit` type supports various health-related units:

| **Unit Type**      | **Examples**          |
| ------------------ | --------------------- |
| `BloodGlucoseUnit` | `MmolPerL`, `MgPerDL` |
| `WeightUnit`       | `Kg`, `Lbs`           |
| `HeightUnit`       | `Cm`, `Inches`        |
| `HeartRateUnit`    | `BeatsPerMinute`      |

---

### **Example Usage**

#### **Write Blood Pressure Data**

```typescript
write(HealthLinkDataType.Height, {
  value: 165,
  unit: HeighUnit.Cm,
});
```
