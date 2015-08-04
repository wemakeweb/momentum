var fs = require('fs');


/**
 * readdirRecursiveSync
 * @param {String} rootDir
 * @returns {Array} list of all files
 *
 * Recursivly gets all files -
 * Dotfiles and files prefixed with a
 * dash wount be loaded
 */

exports.readdirRecursiveSync = function( rootDir ){

	return (function travel( dir, dirs, traveld ){
		var files = []

		try {
			files = fs.readdirSync(dir);
		} catch(err){
			return files;
		}

		files.forEach(function(file){
	    	/**
	    	 * Dont load dotfiles and dashed files
	    	 * ProTipp: prefix files with a dash to prevent the loading
	    	 */
	    	if (file.charAt(0) === '.' || file.charAt(0) === '_'){
	    		return;
	    	}

        	var filePath = [dir, file].join('/'),
            	stat = fs.statSync(filePath);

            if (stat.isDirectory()){
            	var copy = traveld.slice();

            	copy.push(file);
            	travel(filePath, dirs, copy);
            } else {
            	var p = traveld.join('/');
            	dirs.push({ path: filePath, name: (p ? p + '/' : '' ) + formatName(file) });
            }
	    });

	    return dirs;
	})(rootDir, [], []);
};

/**
 * replaces .js
 * @api private
 */

function formatName(str){
	return str.charAt(0).toUpperCase() + str.slice(1).replace('.js', '');
}