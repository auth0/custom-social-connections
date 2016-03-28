var metrics = new Auth0Metrics('@segmentKey', '@dwhEndpoint', 'custom-social-connections');

module.exports.track = function (event, connection) {
  try {
    metrics.track('custom-social-connections:'+event, { trackData: connection });
  } catch (err) {
    console.log('Error trying to send metrics :', err);
  }
}
