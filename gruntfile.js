'use strict';

module.exports = function (grunt) {

    var CLIENT_LIB_FILES = [
        'src/js/lib/bower/jquery/dist/jquery.js',
        'src/js/lib/bower/angular/angular.js',
        'src/js/lib/bower/angular-cookies/angular-cookies.js',
        'src/js/lib/bower/angular-resource/angular-resource.js',
        'src/js/lib/bower/angular-bootstrap/ui-bootstrap.js',
        'src/js/lib/bower/angular-ui-router/release/angular-ui-router.js'
    ];

    var CLIENT_SRC_FILES = [
        'src/js/app.js',
        'src/js/controllers/*.js',
        'src/js/directives/*.js',
        'src/js/filters/*.js',
        'src/js/services/*.js',
        'src/js/config/*.js',
        'src/js/startApp.js'
    ];

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env : {
            options : {

            },
            dev : {
                NODE_ENV : 'development'
            },
            prod : {
                NODE_ENV : 'production'
            }
        },
        watch: {
            js : {
                files : ['src/js/**/*.js'],
                tasks : ['jshint', 'concat'],
                options : {
                    livereload : true
                }
            },
            jade : {
                files : ['src/jade/**/*.jade'],
                tasks : ['jade'],
                options : {
                    livereload : true
                }
            },
            less : {
                files : ['src/css/**/*.less'],
                tasks : ['less'],
                livereload : true
            }
        },
        jshint: {
            all: {
                src: [
                    'gruntfile.js',
                    'src/js/**/*.js',
                    '!src/js/lib/bower/**'
                ],
                options: {
                    jshintrc: true,
                    data : {
                        livereload : function() {
                            return process.env.NODE_ENV === 'development';
                        }
                    }
                }
            }
        },
        less: {
            www : {
                options: {
                    port      : 8000,
                    compile   : true,
                    cleancss  : true,
                    sourceMap : function() {
                        return process.env.NODE_ENV === 'development';
                    }
                },
                files: [
                    {
                        dest : 'bluetoothcar/www/css/index.css',
                        src  : ['src/css/**/*.less', 'src/js/lib/bower/bootstrap/less/bootstrap.less']
                    }
                ]
            }
        },
        copy: {
            www : {
                files: [
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : 'bluetoothcar/www/img/',
                        cwd     : 'src/',
                        src     : ['img/**']
                    },
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : 'bluetoothcar/www/fonts',
                        cwd     : 'src/',
                        src     : ['fonts/**']
                    }
                ]
            }
        },
        concat: {
            dist: {
                src: CLIENT_LIB_FILES.concat(CLIENT_SRC_FILES),
                dest: 'bluetoothcar/www/js/index.js'

            }
        },
        clean: ['bluetoothcar/www'],
        jade: {
            compile: {
                files: [{
                    cwd    : 'src/jade/',
                    src    : ['*.jade', 'partials/*.jade'],
                    dest   : 'bluetoothcar/www/',
                    expand : true,
                    ext    : '.html'
                }],
                options: {
                    client: false,
                    pretty: true,
                    data : {
                        livereload : function() {
                            return process.env.NODE_ENV === 'development';
                        }
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    hostname  : '*',
                    port      : 8000,
                    base      : 'bluetoothcar/www',
                    keepalive : true,
                    open      : {
                        target: 'http://localhost:8000'
                    }
                }
            }

        },
        concurrent: {
            tasks: ['connect', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        exec : {
            prepare : {
                command  : 'cordova prepare',
                stdout   : true,
                stderror : true,
                cwd      : 'bluetoothcar'
            },
            serve : {
                command  : 'cordova serve',
                stdout   : true,
                stderror : true,
                cwd      : 'bluetoothcar'
            },
            build : {
                command  : 'cordova build',
                stdout   : true,
                stderror : true,
                cwd      : 'bluetoothcar'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-exec');

    grunt.registerTask('runServer', ['buildClient', 'concurrent']);

    // Building the Client from the resources in the src folder
    grunt.registerTask('buildClient', ['clean', 'env:dev', 'jshint', 'less:www', 'jade', 'copy', 'concat:dist']);

    // Cordova prepare copies the resources from the bluetoothcar/www folder to its platform folders
    grunt.registerTask('cordovaPrepare', ['exec:prepare']);
    grunt.registerTask('cordovaServe', ['exec:serve']);

    grunt.registerTask('default', ['runServer']);

};