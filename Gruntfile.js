module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('src/manifest.json'),
        crx: {
            dev: {
                src: [
                    "src/**/*"
                ],
                dest: "build/crx/<%= pkg.name %>-dev.crx",
                zipDest: "build/zip/<%= pkg.name %>-dev.zip",
                options: {
                    "privateKey": "key.pem",
                    "maxBuffer": 500 * 1024
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-crx');
    grunt.registerTask('default', ['crx']);
};
