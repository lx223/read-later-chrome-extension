module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        manifest: grunt.file.readJSON('src/manifest.json'),
        crx: {
            dev: {
                src: [
                    "src/**/*"
                ],
                dest: "build/crx/<%= pkg.name %>-<%= manifest.version %>-dev.crx",
                zipDest: "build/zip/<%= pkg.name %>-<%= manifest.version %>-dev.zip",
                options: {
                    "privateKey": "key.pem"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-crx');
    grunt.registerTask('default', ['crx']);
};
