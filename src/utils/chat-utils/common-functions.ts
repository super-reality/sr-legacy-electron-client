export const onTextChange = (e: any, set: (value: any) => void) => {
  const message = e.target.value;
  set(message);
};

export function handleEnterDownEdit(
  e: React.KeyboardEvent<HTMLInputElement>,
  submit: () => void
) {
  if (e.key === "Enter") {
    submit();
  }
}

export const dummyFunction = () => {
  console.log("dummy test functinon");
};
