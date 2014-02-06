module.exports = function() {
  var dir;
  dir = process.cwd();
  switch (process.env.NODE_ENV) {
    case 'production':
      return {
        staticDir: dir
      };
    default:
      return {
        staticDir: "" + dir + "/client/public"
      };
  }
};
