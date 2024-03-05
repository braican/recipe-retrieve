export const getMeal = (): string => {
  const currentTime = new Date();
  const hour = currentTime.getHours();

  if (hour >= 5 && hour < 11) {
    return 'breakfast';
  }
  if (hour >= 11 && hour < 15) {
    return 'lunch';
  }
  if (hour >= 15 && hour < 23) {
    return 'dinner';
  }

  return 'midnight snack';
};
