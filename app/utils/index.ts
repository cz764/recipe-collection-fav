export const randomRecipeIndexFromDate = (srcArrayLength) => {
  const date = new Date();
  return (
    (date.getFullYear() * date.getDate() * (date.getMonth() + 1)) %
    srcArrayLength
  );
};
