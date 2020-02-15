module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                'output.comments': 'all',
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/bundle.<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
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
                src: ['build/<%= pkg.name %>.js', 'src/scripts/swiped-events.min.js'],
                dest: 'build/bundle.<%= pkg.name %>.js',
            },
        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            site: {
                src: ['src/style/<%= pkg.name %>.css'],
                dest: 'dist/style/<%= pkg.name %>.min.css'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', ['ts', 'concat', 'uglify', 'cssmin']);

};