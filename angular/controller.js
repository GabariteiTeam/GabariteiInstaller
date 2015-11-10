(function(){
	'use strict';

	angular
        .module(APP_NAME)
        .controller('InstallController', InstallController);

    InstallController.$inject = ['$scope', 'Installer'];
    function InstallController($scope, Installer) {
    	var vm     = this;
        vm.output  = [];
    	vm.env     = {};
        vm.debug   = true;
        vm.path    = "~/gabaritei-project/";


    	Installer.set_env(vm.env);
    	Installer.verify_os();
    	Installer.next_step_success(install_with_ruby);
    	Installer.verify_ruby();

    	function install_with_ruby() {
    		print_log("Ruby interperter was found!");
    		print_log("PATH: " + vm.env.ruby_path);
            Installer.next_step_success(install_with_node);
            Installer.verify_node();
    	}

        function install_with_node() {
            print_log("Node interperter was found!");
            print_log("PATH: " + vm.env.node_path);
            Installer.next_step_success(install_with_git);
            Installer.verify_git();
        }

        function install_with_git() {
            print_log("Git was found!");
            print_log("PATH: " + vm.env.node_path);
            Installer.next_step_success(git_cloned);
            Installer.git_clone(vm.path);
        }

        function git_cloned(PATH) {
            print_log("Git was cloned with sucess!");
            print_log("Starting install of ruby gems...");
            Installer.next_step_success(install_node_packages);
            Installer.install_gems(vm.path);
        }

        function install_node_packages() {
            print_log("Ruby gem installed!");
            print_log("Installing node packages...");
            Installer.next_step_success(install_bower_files);
            Installer.install_node_apps(vm.path);
        }

        function install_bower_files() {
            print_log("Installed node packages!");
            print_log("Preparing to install bower files");

            Installer.next_step_success(install_db);
            Installer.install_bower_files(vm.path);
        }

        function install_db() {
            print_log("Bower files installed with success!");
            print_log("Getting db ready...");
						Installer.next_step_success(end_install);
						Installer.prepare_database(vm.path);
        }

				function end_install() {
					window.close();
				}


    	function print_log(msg) {
    		if(vm.debug) {
                console.log(msg);
            }

    	}
    }


})();
