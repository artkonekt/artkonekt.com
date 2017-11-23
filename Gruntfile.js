module.exports = function(grunt) {

    grunt.initConfig({
        compass: {
            prod: {
                options: {
                    sassDir: 'sass',
                    cssDir: 'public/css',
                    outputStyle: 'compressed',
                    noLineComments: true,
                    environment: 'production'
                }
            }
        },

        clean: {
            build: ['public/css/style.css']
        },

        watch: {
            compass: {
                files: 'sass/**/*.sass',
                tasks: ['compass']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask(
        'default',
        'Compiles sass sheets and copies the files to the public css directory.',
        ['clean', 'compass']
    );

};