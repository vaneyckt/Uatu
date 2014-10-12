require 'yaml'
require 'sinatra/base'

class MyApp < Sinatra::Base
  set :environment, :production

  get '/' do
    config  = YAML.load_file(File.dirname(__FILE__) + "/config.yaml")
    @auth   = config["auth"]
    @builds = config["builds"]
    erb :overview
  end
end
