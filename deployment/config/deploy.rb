require 'capistrano/ext/multistage'

# =============================================================================
# SCM OPTIONS
# =============================================================================
set :scm, :git          # or :git
set :repository, "git@github.com:marlon-be/knockout-jenkins.git"

# =============================================================================
# REQUIRED VARIABLES
# =============================================================================
set :current_dir, "release"

# =============================================================================
# SSH OPTIONS
# =============================================================================
set :user, "root"
set :use_sudo, false           # optional
set :ssh_options, { :forward_agent => true }

# =============================================================================
# STAGES
# =============================================================================
set :stages, ["development"]
set :default_stage, "development"
set :stage_dir, "config/deploy"


# =============================================================================
# RELEASE
# =============================================================================
set :keep_releases, 5
set :deploy_via, :copy
set :copy_cache, "_build"

set :copy_exclude, [
    ".git",
    ".gitignore",
    "deployment",
    "**/.git",
    "**/.gitignore"
]

# =============================================================================
# TASKS
# =============================================================================

before "deploy:finalize_update", "deploy:robots"

namespace :deploy do

    task :update_code, :except => { :no_release => true } do
      on_rollback { run "rm -rf #{release_path}; true" }
      strategy.deploy!
      finalize_update
    end

    task :finalize_update do
        transaction do
            run "chmod -R g+w #{latest_release}" if fetch(:group_writable, true)
        end
    end

    task :create_symlink, :except => { :no_release => true } do
        on_rollback do
          if previous_release
            run "rm -f #{current_path}; ln -s #{previous_release} #{current_path}; true"
          else
            logger.important "no previous release to rollback to, rollback of symlink skipped"
          end
        end

        run "rm -f #{current_path} && ln -s #{latest_release} #{current_path}"
    end

    task :robots do
        robots = <<-EOF
User-agent: *
Disallow: /
      EOF
        put robots, "#{latest_release}/robots.txt"
    end
end
