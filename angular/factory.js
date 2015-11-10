(function(){
	'use strict';
	angular
		.module(APP_NAME)
		.factory('Installer', Installer);

	function Installer() {
		var env;
		var git_path = "https://github.com/GabariteiTeam/Gabaritei.git";

		var next_step_success;
		var next_step_error;

		function set_env(_env) {
			env = _env;
		}

		function verify_ruby() {
			if(is_unix()) {
				var exec 	= require('child_process').exec;
				var child 	= exec("which ruby", function(error, stdout, stderr){
					set_path(stdout, "ruby_path");
				});
			}
		}

		function verify_node() {
			if(is_unix()) {
				var exec 	= require('child_process').exec;
				var child 	= exec("which node", function(error, stdout, stderr){
					set_path(stdout, "node_path");
				});
			}
		}

		function verify_git() {
			if(is_unix()) {
				var exec 	= require('child_process').exec;
				var child 	= exec("which git", function(error, stdout, stderr){
					set_path(stdout, "git_path");
				});
			}
		}

		function git_clone(path) {
			var exec 	= require('child_process').exec;
			var child 	= exec("git clone " + git_path + " " + path, function(error, stdout, stderr){
				next_step_success();
			});
		}

		function install_gems(path) {
			var exec 	= require('child_process').exec;
			console.log(path + "bin/bundle install");
			var child 	= exec(path + "bin/bundle install", function(error, stdout, stderr){
				console.log(stdout);
				next_step_success();
			});
		}

		function install_node_apps(path) {
			var exec 	= require('child_process').exec;
			var command = "cd " + path + " && npm install"
			var child 	= exec(command, function(error, stdout, stderr){
				console.log(stdout);
				next_step_success();
			});
		}

		function install_bower_files(path) {
			var exec 	= require('child_process').exec;
			var command = "cd " + path + " && rake bower:install";
			console.log(command);
			var child 	= exec(command, function(error, stdout, stderr){
				console.log(stdout);
				next_step_success();
			});
		}

		function prepare_database(path) {
			var exec 	= require('child_process').exec;
			var command = "cd " + path + " && rake db:lazy";
			console.log(command);
			var child 	= exec(command, function(error, stdout, stderr){
				console.log(stdout);
				next_step_success();
			});
		}

		function check_error(stderr) {
			if(stderr.length > 0) {
				this.close();
			}
		}

		function set_path(result, app) {
			if(result.length > 0) {
				  	env[app] = result;
				  	next_step_success();
				  }
		}

		function is_unix() {
			return (env.OS == 'MAC' || env.OS == 'LINUX');
		}

		function verify_os() {
			switch (process.platform) {
				case 'darwin':
					env.OS = 'MAC';
				break;
				case 'win32':
					env.OS = 'WIN';
					break;
				case 'linux':
					env.OS = 'LINUX';
				break;
			}
			return env.OS;
		}



		return {
			set_env: set_env,
			verify_os: verify_os,
			verify_ruby: verify_ruby,
			verify_node: verify_node,
			verify_git: verify_git,
			git_clone: git_clone,
			install_gems: install_gems,
			install_node_apps: install_node_apps,
			install_bower_files: install_bower_files,
			prepare_database: prepare_database,
			next_step_success: function(_next_step_success) { next_step_success = _next_step_success},
			next_step_error: next_step_error
		}
	}

})();
