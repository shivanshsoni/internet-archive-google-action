const {debug, info} = require('../../../utils/logger')('ia:actions:middlewares:playlist-from-feeder');
const {MiddlewareError} = require('./error');

/**
 * Update playlist data from feeder
 * - usually we create new playlist
 */
module.exports = () => (context) => {
  debug('start');
  const {app, feeder, playlist, slotScheme} = context;
  playlist.setFeeder(app, slotScheme.fulfillment);
  return feeder
    .build(context)
    .then(() => {
      if (feeder.isEmpty(context)) {
        // TODO: should give feedback about problem
        debug('empty playlist');
        return Promise.reject(new MiddlewareError(context, {emptyPlaylist: true}));
      }
      return context;
    })
    .catch((error) => {
      info('fail on creating playlist', error);
      return Promise.reject(
        Object.assign({}, context, {error})
      );
    });
};
