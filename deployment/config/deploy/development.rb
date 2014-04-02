# DEVELOPMENT-specific deployment configuration
# please put general deployment config in config/deploy.rb
server "192.168.0.102", :app, :web, :db, :primary => true

set :application, "ci.marlon.be"
set :application_env, "development"
set :branch, "master"
set :user, "ci"
set :deploy_to, "/home/ci"
set :copy_remote_dir, "/home/ci"
