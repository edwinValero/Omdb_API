export const getOffsetFromPage = (page: number): number => {
  const offset = 10 * (page - 1);
  return offset < 0 ? 0 : offset;
};

export const getPageFromQuery = (queryParam: object) => {
  const page = get(queryParam, 'page');
  if (!page || isNaN(page)) {
    return 1;
  }
  return Number.parseInt(page);
};

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Taken from https://youmightnotneed.com/lodash/#get
export const get = (object: any, path: string | string[], value?: any) => {
  // If path is not defined or it has false value
  if (!path) return undefined;
  // Check if path is string or array. Regex : ensure that we do not have '.' and brackets
  const pathArray = Array.isArray(path)
    ? path
    : path.split(/[,[\].]/g).filter(Boolean);
  // Find value if exist return otherwise return undefined value;
  return (
    pathArray.reduce(
      (prevObj, key: string) => prevObj && prevObj[key],
      object
    ) || value
  );
};
