module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            css: {
                src: 'app/styles/vg-next-video.css',
                dest: 'app/styles/vg-next-video.min.css'
            }
        },
        concat: {
            plugin: {
                src: [
                    'app/scripts/com/2fdevs/videogular/plugins/vg-contextual-overlay/vg-next-video.js',
                    'app/scripts/com/2fdevs/videogular/plugins/vg-contextual-overlay/vg-next-video-service.js'
                ],
                dest: 'app/dist/vg-next-video.js'
            }
        },
        uglify: {
            js: {
                files: {
                    'app/dist/vg-next-video.min.js': ['app/dist/vg-next-video.js']
                }
            }
        },
        copy: {
            css: {
                files: [
                    {expand: true, src: ['app/styles/vg-next-video/*'], dest: 'app/dist/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['cssmin:css', 'concat:plugin', 'uglify:js', 'copy:css']);
};
