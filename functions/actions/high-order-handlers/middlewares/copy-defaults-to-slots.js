const debug = require('debug')('ia:actions:middleware:copy-arguments-to-slots:debug');

/**
 * Middleware
 * which transfer defaults to slots
 *
 * @param app
 * @param newValues
 * @param query
 * @param slotScheme
 * @returns {Promise.<{app: *, newValues, query: *, slotScheme: *}>}
 */
module.exports = () =>
  // use this one, once firebase would support modern node.js
  //   ({app, newValues = {}, query, slotScheme, ...res}) => {
  args => {
    let {app, newValues = {}, query, slotScheme} = args;
    debug('apply copy defaults to slots middleware');
    if (slotScheme.defaults) {
      debug(`we have [${Object.keys(slotScheme.defaults)}] to check`);
      newValues = Object.entries(slotScheme.defaults)
        .reduce((newValues, [slotName, value]) => {
          if (value) {
            query.setSlot(app, slotName, value);
            newValues = Object.assign({}, newValues, {[slotName]: value});
          }
          return newValues;
        }, newValues);
      debug(`and copied ${JSON.stringify(newValues)} slot(s)`);
    }

    return Promise.resolve(
      Object.assign({}, args, {app, newValues, query, slotScheme})
    );// use this one, once firebase would support modern node.js
    // return Promise.resolve({app, newValues, query, slotScheme, ...res});
  };
