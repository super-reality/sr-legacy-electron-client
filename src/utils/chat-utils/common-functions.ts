export const onTextChange = (e: any, set: (value: any) => void) => {
  const message = e.target.value;
  set(message);
};

export const dummyFunction = () => {
  console.log("dummy test functinon");
};
