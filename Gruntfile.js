/**
 *todo: Проверить что изображения сжимаются
 *
 */
module.exports = function (grunt) {

    grunt.initConfig({
        clean: {
            build: ['dist'],
            images: ['dist/images'],
            js: ['dist/js'],
            jsBuffer: ['dist/buffer/*.js'],
            buffer: ['dist/buffer'],
            css: ['dist/css'],
            html: ['dist/**/*.html']
        },
        jshint: {
            files: ['Gruntfile.js', 'src/js/**/*.js'],
            options: {
                browser: true,
                devel: true
            }
        },
        jslint: {
            client: {
                src: [
                    'src/js/**/*.js'
                ],
                directives: {
                    browser: true,
                    predef: [
                        'jQuery',
                        '$'
                    ]
                },
                options: {
                    failOnError: false,
                    devel: true
                }
            }
        },
        concat: {
            js: {
                src: [
                    'libs/jquery/dist/jquery.min.js',
                    /* bootstrap */
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/button.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
                    'libs/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
                    /* end bootstrap */
                    'libs/bootstrap/src/js/includes/functions.js',
                    'libs/bootstrap/src/js/main.js'
                ],
                dest: 'dist/buffer/compiled.js'
            }
        },
        uglify: {
            compile: {
                src: ['dist/buffer/compiled.js'],
                dest: 'dist/js/compiled.min.js'
            }
        },
        imagemin: {
            images: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/images/'
                }]
            }
        },
        includereplace: {
            html: {
                files: [{src: '*.html', dest: 'dist/', expand: true, cwd: 'src/html/'}]
            }
        },
        htmllint: {
            all: ['dist/*.html']
        },
        scsslint: {
            allfiles: [
                'src/styles/scss/**/*.scss'
            ],
            options: {
                force: true,
                exclude: ['./src/styles/scss/font-awesome/**', './src/styles/scss/bourbon/**',]//если не примут мой pull request то не будет работать
            }
        },
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            main: {
                files: {
                    'dist/css/compiled.min.css': 'src/styles/scss/compiled.scss'
                }
            },
            header: {
                options: {
                    sourceMap: false
                },
                files: {
                    'src/styles/css/header.min.css': 'src/styles/scss/header.scss'
                }
            },
            fonts: {
                files: {
                    'dist/css/fonts.min.css': 'src/styles/scss/fonts.scss'
                }
            }
        },
        copy: {
            fonts: {
                expand: true,
                cwd: 'src/fonts',
                src: '*',
                dest: 'dist/fonts/'
            }
        },
        watch: {
            js: {
                files: ['<%= jshint.files %>'],
                tasks: ['scripts']
            },
            config: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                }

            },
            styles: {
                files: ['src/styles/scss/compiled.scss', 'src/styles/scss/fonts.scss'],
                tasks: ['styles'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['src/html/**/*.html', 'src/styles/scss/header.scss'],
                tasks: ['html']
            },
            images: {
                files: ['src/images/**/*.{png,jpg,gif}'],
                tasks: ['images']
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'dist/css/*.css',
                        'dist/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: './dist'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-scss-lint');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['images', 'html', 'styles', 'scripts', 'copy:fonts', 'browserSync', 'watch']);
    grunt.registerTask('scripts', ['jshint', 'jslint', 'concat:js', 'uglify', 'clean:jsBuffer']);
    grunt.registerTask('html', ['sass:header', 'clean:html', 'includereplace:html', 'htmllint', 'scsslint']);
    grunt.registerTask('styles', ['scsslint', 'sass:fonts', 'sass:main']);
    grunt.registerTask('images', ['imagemin']);
    grunt.registerTask('build', ['clean:dist', 'images', 'html', 'styles', 'copy:fonts', 'scripts']);

};


