const byteUnitArray = [' KB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];

export const SizeConverter = (byteSize: number | undefined) => {
  if (byteSize === undefined) return '잘못된 크기 입니다.';

  let i = -1;

  do {
    byteSize /= 1024;
    ++i;
  } while (byteSize > 1024);

  return Math.max(byteSize, 0.1).toFixed(1) + byteUnitArray[i];
};
