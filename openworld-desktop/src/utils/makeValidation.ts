interface ValidationField {
  name: string;
  minLength?: number;
  minItems?: number;
  maxItems?: number;
}

type ValidationFields = Record<string, ValidationField>;

export default function makeValidation(
  fields: ValidationFields,
  data: Record<string, any>
) {
  const reasons: string[] = [];
  Object.keys(data).forEach((key) => {
    const valid = fields[key];
    if (valid) {
      // Check min length
      if (valid.minLength) {
        if (data[key].length == 0) reasons.push(`${valid.name} is required`);
        else if (data[key].length < valid.minLength && valid.minLength !== 0)
          reasons.push(`${valid.name} is too short`);
      }
      // Check min array size
      if (valid.minItems) {
        if (data[key].length < 1 && valid.minItems == 1)
          reasons.push(`At least one ${valid.name} is required`);
        else if (data[key].length < valid.minItems && valid.minItems !== 0)
          reasons.push(
            `At least ${valid.minItems} ${valid.name}s are required`
          );
      }
      // Check max array length
      if (valid.maxItems) {
        if (data[key].length > valid.maxItems)
          reasons.push(
            `${valid.name} can have at most ${valid.maxItems} entries`
          );
      }
    }
  });

  return reasons;
}
