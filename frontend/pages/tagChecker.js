const check = [
    "Object",
    "Function",
    "Number",
    "String",
    "Array",
    "Date",
    "Null",
    "Undefined",
    "RegExp",
  ];
  
  const __TS__ = Object.prototype.toString;
  
  const checker = check.reduce((acc, marker) => {
      acc[`is${marker}`] = (value) => {
          return __TS__.apply(value) === `[object ${marker}]`
      };
      return acc
  }, {});
  
  export const isObject = checker.isObject;
  export const isNumber = checker.isNumber;
  export const isFunction = checker.isFunction;
  export const isString = checker.isString;
  export const isRegExp = checker.isRegExp;
  export const isArray = checker.isArray;
  export const isDate = checker.isDate;
  export const isNull = checker.isNull;
  export const isUndefined = checker.isUndefined;
  