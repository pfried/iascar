'use strict';

module.exports = function (grunt) {

    var chromeBuildPath = 'chrome/dist';
    var cordovaBuildPath = 'bluetoothcar/www';

    var CLIENT_LIB_FILES = [
        //'src/js/lib/bower/jquery/dist/jquery.js',
        'src/js/lib/bower/angular/angular.js',
        'src/js/lib/bower/angular-cookies/angular-cookies.js',
        'src/js/lib/bower/angular-touch/angular-touch.js',
        'src/js/lib/bower/angular-resource/angular-resource.js',
        'src/js/lib/bower/angular-ui-router/release/angular-ui-router.js',
        'src/js/lib/bower/angular-translate/angular-translate.js',
        'src/js/lib/bower/angular-translate-loader-static-files/angular-translate-loader-static-files.js'
    ];

    var MOCK_LIB = [
        'src/js/lib/bower/angular-mocks/angular-mocks.js',
    ];

    var MOCK_FILES = [
        'src/js/mocks/**/*.js'
    ];

    var CLIENT_SRC_FILES = [
        'src/js/app.js',
        'src/js/controllers/*.js',
        'src/js/directives/*.js',
        'src/js/filters/*.js',
        'src/js/services/*.js',
        'src/js/config/*.js',
        'src/js/routes/*.js',
        'src/js/startApp.js'
    ];

    var POLYMER_OBJECTS = [
        'platform/**',
        'polymer/**',
        'core-*/**',
        'paper-*/**'
    ];

    var CLIENT_SPEC_FILES = [
        'src/js/tests/**/*.spec.js'
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
                files : ['src/less/**/*.less'],
                tasks : ['less'],
                options : {
                    livereload : true
                }
            },
            lang : {
                files : ['src/js/lang/**'],
                tasks : ['copy'],
                options : {
                    livereload : true
                }
            },
            grunt : {
                files : ['gruntfile.js']
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
            cordova : {
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
                        dest : cordovaBuildPath + '/css/index.css',
                        src  : ['src/less/**/*.less']
                    }
                ]
            },
            chrome : {
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
                        dest : chromeBuildPath + '/css/index.css',
                        src  : ['src/less/**/*.less']
                    }
                ]
            }
        },
        copy: {
            cordova : {
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
                        cwd     : 'src/fonts/',
                        src     : ['**',]
                    },
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : 'bluetoothcar/www/fonts',
                        cwd     : 'src/js/lib/bower/roboto-fontface/fonts/',
                        src     : ['**']
                    },
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : 'bluetoothcar/www/',
                        cwd     : 'src/js/',
                        src     : ['lang/**']
                    },
                    {
                        expand  : true,
                        dest    : 'bluetoothcar/www/polymer',
                        cwd     : 'src/js/lib/bower',
                        src     : POLYMER_OBJECTS
                    }
                ]
            },
            chrome : {
                files: [
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : chromeBuildPath + '/img/',
                        cwd     : 'src/',
                        src     : ['img/**']
                    },
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : chromeBuildPath,
                        cwd     : 'src/',
                        src     : ['fonts/**']
                    },
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : chromeBuildPath,
                        cwd     : 'src/js/lib/bower/roboto-fontface/',
                        src     : ['fonts/**']
                    },
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : chromeBuildPath,
                        cwd     : 'src/js',
                        src     : ['lang/**']
                    },
                    {
                        expand  : true,
                        dest    : chromeBuildPath + '/polymer',
                        cwd     : 'src/js/lib/bower',
                        src     : POLYMER_OBJECTS
                    },
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : chromeBuildPath,
                        cwd     : 'chrome',
                        src     : ['manifest.json']
                    },
                    {
                        expand  : true,
                        flatten : false,
                        filter  : 'isFile',
                        dest    : chromeBuildPath,
                        cwd     : 'chrome/js',
                        src     : ['**']
                    }
                ]
            }
        },
        concat: {
            cordovaDist: {
                src: CLIENT_LIB_FILES.concat(CLIENT_SRC_FILES),
                dest: cordovaBuildPath + '/js/index.js'
            },
            cordovaMock: {
                src: CLIENT_LIB_FILES.concat(MOCK_LIB).concat(MOCK_FILES).concat(CLIENT_SRC_FILES),
                dest: cordovaBuildPath + '/js/index.js'
            },
            chromeDist : {
                src: CLIENT_LIB_FILES.concat(CLIENT_SRC_FILES),
                dest: chromeBuildPath + '/js/index.js'
            }
        },
        clean: {
            cordova : [cordovaBuildPath],
            chrome  : [chromeBuildPath]
        },
        jade: {
            cordova: {
                files: [{
                    cwd    : 'src/jade/',
                    src    : ['*.jade', 'partials/*.jade', 'directives/*.jade'],
                    dest   : cordovaBuildPath,
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
            },
            chrome : {
                files: [{
                    cwd    : 'src/jade/',
                    src    : ['*.jade', 'partials/*.jade', 'directives/*.jade'],
                    dest   : chromeBuildPath,
                    expand : true,
                    ext    : '.html'
                }],
                options: {
                    client: false,
                    pretty: true,
                    data : {
                        livereload : false
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    hostname  : '*',
                    port      : 8000,
                    base      : cordovaBuildPath,
                    keepalive : true,
                    open      : {
                        target: 'http://localhost:8000'
                    }
                }
            }

        },
        karma: {
            endless : {
                configFile: 'karma.conf.js',
                singleRun: false,
                browsers: ['PhantomJS']
            },
            once : {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        plato: {
            all : {
                options: {
                    jshint : grunt.file.readJSON('.jshintrc')
                },
                files : {
                    'reports' : ['gruntfile.js'].concat(CLIENT_SRC_FILES).concat(CLIENT_SPEC_FILES).concat(MOCK_FILES)
                }
            }
        },
        concurrent: {
            tasks: ['connect', 'watch', 'karma:endless'],
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
            },
            runAndroid : {
                command : 'cordova run android',
                stdout   : true,
                stderror : true,
                cwd      : 'bluetoothcar'
            },
            buildAndroidRelease : {
                command  : 'cordova build android --release',
                stdout   : true,
                stderror : true,
                cwd      : 'bluetoothcar'
            },
            buildIOSRelease : {
                command  : 'cordova build ios --release',
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
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-plato');

    grunt.registerTask('runServer', ['buildCordovaClientMock', 'concurrent']);

    // Building the Cordova Client from the resources in the src folder
    grunt.registerTask('buildCordovaClient', ['clean:cordova', 'env:dev', 'jshint', 'less:cordova', 'jade:cordova', 'copy:cordova', 'concat:cordovaDist']);
    grunt.registerTask('buildCordovaClientMock', ['clean:cordova', 'env:dev', 'jshint', 'less:cordova', 'jade:cordova', 'copy:cordova', 'concat:cordovaMock']);

    // Building the Chrome Client from the resources from the src and chrome folder
    grunt.registerTask('buildChromeClient', ['clean:chrome', 'env:prod', 'jshint', 'less:chrome', 'jade:chrome', 'copy:chrome', 'concat:chromeDist']);

    // Unit testing and JSHint Static Code Check
    grunt.registerTask('test', ['jshint', 'karma:once', 'plato:all']);

    // Cordova prepare copies the resources from the bluetoothcar/www folder to its platform folders
    grunt.registerTask('cordovaPrepare', ['exec:prepare']);
    grunt.registerTask('cordovaServe', ['exec:serve']);
    grunt.registerTask('cordovaBuild', ['exec:build']);
    grunt.registerTask('cordovaRunAndroid', ['buildCordovaClient', 'exec:prepare', 'exec:runAndroid']);

    grunt.registerTask('cordovaBuildAndroidRelease', ['exec:buildAndroidRelease']);
    grunt.registerTask('cordovaBuildIOSRelease', ['exec:buildIOSRelease']);

    grunt.registerTask('default', ['runServer']);

};