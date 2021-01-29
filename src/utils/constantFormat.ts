export default function constantFormat<T>(
  options: any
): (option: T | string) => string {
  type OptionsType = keyof typeof options;
  return (value) =>
    Object.keys(options).filter((k) => options[k as OptionsType] == value)[0];
}
