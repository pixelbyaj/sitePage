module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                output: {
                    comments: 'all'
                },
                banner: '/*!\n <%= pkg.name %> - v<%= pkg.version %>\n* https://github.com/pixelbyaj/SitePage\n* @author Abhishek Joshi\n* @license MIT*/'
            },
            build: {
                src: 'build/<%= pkg.buildName %>.js',
                dest: 'dist/<%= pkg.buildName %>.min.js'
            }
        },
        ts: {
            default: {
                tsconfig: './tsconfig.json'
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['build/<%= pkg.buildName %>.js', 'src/scripts/swiped-events.min.js'],
                dest: 'build/<%= pkg.buildName %>.js',
            },
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            site: {
                src: ['src/style/<%= pkg.buildName %>.css'],
                dest: 'dist/style/<%= pkg.buildName %>.min.css'
            }
        },
        clean: ['build/', 'dist/']
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('build', ['clean', 'ts', 'concat', 'uglify', 'cssmin']);

};