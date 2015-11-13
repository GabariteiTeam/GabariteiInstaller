(function(){
	'use strict';

	angular
        .module(APP_NAME)
        .controller('InstallController', InstallController);

    InstallController.$inject = ['$scope', 'Installer'];
    function InstallController($scope, Installer) {
    	var vm          = this;
        vm.output       = [];
    	vm.env          = {};
        vm.debug        = true;
        vm.path         = "~/gabaritei-project/";
        vm.quit_app     = quit_app;
        updateProgressBar("0");


    	Installer.set_env(vm.env);
    	Installer.verify_os();
    	Installer.next_step_success(install_with_ruby);
        Installer.next_step_error(error_handler);
    	Installer.verify_ruby();

        function quit_app() {
            window.close();
        }

    	function install_with_ruby() {
            updateProgressBar(5);
    		print_log("Ruby interperter was found!");
    		print_log("PATH: " + vm.env.ruby_path);
            Installer.next_step_success(install_with_node);
            Installer.verify_node();
    	}

        function install_with_node() {
            updateProgressBar(10);
            print_log("Node interperter was found!");
            print_log("PATH: " + vm.env.node_path);
            Installer.next_step_success(install_with_git);
            Installer.verify_git();
        }

        function install_with_git() {
            updateProgressBar(15);
            print_log("Git was found!");
            print_log("PATH: " + vm.env.node_path);
            Installer.next_step_success(git_cloned);
            Installer.git_clone(vm.path);
        }

        function git_cloned(PATH) {
            updateProgressBar(30);
            print_log("Git was cloned with sucess!");
            print_log("Starting install of ruby gems...");
            Installer.next_step_success(install_node_packages);
            Installer.install_gems(vm.path);
        }

        function install_node_packages() {
            updateProgressBar(50);
            print_log("Ruby gem installed!");
            print_log("Installing node packages...");
            Installer.next_step_success(install_bower_files);
            Installer.install_node_apps(vm.path);
        }

        function install_bower_files() {
            updateProgressBar(80);
            print_log("Installed node packages!");
            print_log("Preparing to install bower files");

            Installer.next_step_success(install_db);
            Installer.install_bower_files(vm.path);
        }

        function install_db() {
            updateProgressBar(100);
            print_log("Bower files installed with success!");
            print_log("Getting db ready...");
			Installer.next_step_success(end_install);
			Installer.prepare_database(vm.path);
        }

		function end_install() {
            updateProgressBar(100);
			window.close();
		}

        function error_handler(msg) {
            vm.error_msg = msg;
            $("#error_modal").modal();
            setTimeout(quit_app, 3000);
            $scope.$digest();
        }


    	function print_log(msg) {
    		if(vm.debug) {
                console.log(msg);
            }

    	}
    }


})();
