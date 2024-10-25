export const IsErrorInputValue = (inputValue: string) => {
  return inputValue.trim().replaceAll(' ', '').length < 1;
};
