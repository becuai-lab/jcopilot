import _ from 'lodash';

const Oh = {
  __ver: () => {
    return 'common object helper v0.8';
  },

  getChangedInfo: (obj1: { [x: string]: any } | null, obj2: { [x: string]: any } | null) => {
    const oldKeyList = _.keys(obj1);
    const newKeyList = _.keys(obj2);

    const washed = (obj: null | undefined) => {
      if (obj == null || obj == undefined) return null;
      return JSON.stringify(obj);
    };
    if (obj1 == null || obj2 == null) {
      console.debug('err');
      return [null, null];
    }

    const keyDiffs = _.filter(newKeyList, (key) => washed(obj1?.[key]) != washed(obj2?.[key]));

    if (oldKeyList.includes('paperInfo') && newKeyList.includes('messageQueue')) {
      console.debug('debug ERROR ================');
      return [null, null];
    }

    const result: { [x: string]: any } = {};

    keyDiffs.forEach((key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      const isFuncOrNull1 = val1 == null || _.isFunction(val1);
      const isFuncOrNull2 = val2 == null || _.isFunction(val2);
      if (isFuncOrNull1 && isFuncOrNull2) {
        return [null, null];
      }
      result[key] = val2;
    });

    return [keyDiffs, result];
  },
};

export default Oh;
