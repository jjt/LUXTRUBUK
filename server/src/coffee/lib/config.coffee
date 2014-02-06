module.exports = ()->
  dir = process.cwd()
  switch process.env.NODE_ENV
    when 'production'
      staticDir: dir
    else
      staticDir: "#{dir}/client/public"
