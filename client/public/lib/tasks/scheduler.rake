desc "This task is called by the Heroku cron add-on"
require "net/http"
task :call_page do
   uri = URI.parse('http://luxtrubukapi.jjt.io/api/game/randomHash')
   Net::HTTP.get(uri)
 end

