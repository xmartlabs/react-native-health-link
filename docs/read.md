# `read` Function

The `read` function retrieves health-related data for the specified `HealthLinkDataType` using platform-specific APIs for iOS and Android. It supports filtering and sorting options through the `ReadOptions` interface.

---

## **Example usage**

```typescript
read(HealthLinkDataType.BloodGlucose, {
  unit: BloodGlucoseUnit.MmolPerL,
  startDate: new Date('2021-01-01').toISOString(),
});
```

## **Data types**

Type: HealthLinkDataType
Description: Specifies the type of health data to retrieve. Possible values are:

```
BloodGlucose
Height
Weight
HeartRate
RestingHeartRate
BloodPressure
OxygenSaturation
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

## **`ReadOptions` Interface**

The `ReadOptions` interface defines the optional parameters that can be used to filter, sort, and limit the health data retrieved.

| **Field**   | **Type**  | **Description**                                                                                       | **Default**            |
| ----------- | --------- | ----------------------------------------------------------------------------------------------------- | ---------------------- |
| `startDate` | `string`  | ISO 8601 string specifying the start date for filtering data.                                         | `undefined`            |
| `endDate`   | `string`  | ISO 8601 string specifying the end date for filtering data.                                           | `undefined`            |
| `ascending` | `boolean` | Determines if the results should be sorted in ascending order (`true`) or descending order (`false`). | `false` (descending)   |
| `limit`     | `number`  | Limits the number of results returned.                                                                | `undefined` (no limit) |
| `unit`      | `string`  | The unit of measurement for the data (e.g., `BloodGlucoseUnit.MmolPerL`).                             | `undefined`            |

---

### **Field Explanations**

1. **`startDate`**:

   - Filters the data to include only records starting from this date.
   - Example: `startDate: "2023-01-01T00:00:00Z"` will retrieve data from January 1, 2023.

2. **`endDate`**:

   - Filters the data to include only records up to this date.
   - Example: `endDate: "2023-12-31T23:59:59Z"` will retrieve data until December 31, 2023.
   - If only `endDate` is provided, all data before this date will be retrieved.

3. **`ascending`**:

   - Defines the sorting order of the retrieved data.
   - Example: `ascending: true` will sort results in chronological order, whereas `false` will sort them in reverse chronological order.

4. **`limit`**:

   - Specifies the maximum number of records to retrieve.
   - Example: `limit: 100` retrieves only the first 100 records.

5. **`unit`**:
   - Specifies the unit for the data values.
   - Example: Use `BloodGlucoseUnit.MmolPerL` for `HealthLinkDataType.BloodGlucose`.
   - Use the units that the library exports to avoid mismatch.

---

### **Examples Using `ReadOptions`**

#### Retrieve Blood Glucose Data Between Dates

```typescript
read(HealthLinkDataType.BloodGlucose, {
  startDate: '2021-01-01T00:00:00Z',
  endDate: '2021-12-31T23:59:59Z',
  unit: BloodGlucoseUnit.MmolPerL,
});
```
