exports.__OS 		= "";
exports.__ruby_path = "";


exports.verify_os 		= verify_os;
exports.verify_ruby 	= verify_ruby;
exports.get_os			= get_os;
exports.get_ruby_path 	= get_ruby_path;


function get_ruby_path() {
	console.log(__ruby_path);
	return __ruby_path;
}

function get_os() {
	return __OS;
}

function verify_os() {
	switch (process.platform) {
		case 'darwin':
			__OS = 'unix';
		break;
		case 'win32':
			__OS = 'win'
		break;
	}
	return __OS;
}

function is_unix() {
	return __OS == 'unix';
}

function verify_ruby() {
	if(is_unix()) {
		var exec 	= require('child_process').exec;
		var child 	= exec("which ruby", function (error, stdout, stderr) {
		  if(stdout.length > 0) {
		  	__ruby_path = stdout;
		  	console.log(__ruby_path);
		  	console.log("Sucesso");
		  }
		});
	}
}

