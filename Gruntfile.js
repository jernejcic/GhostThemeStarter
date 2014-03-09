module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      sass: {
        files: ['hover/assets/css/*.scss'],
        tasks: ['sass:dev'],
        options: {
          livereload: true
        }
      }
    },
    sass: {
      dist: {
        files: {
          'theme/assets/css/post.css': 'theme/assets/css/post.css',
          'theme/assets/css/screen.css': 'theme/assets/css/screen.scss'
        },
        options: {
          style: 'compressed'
        }
      },
      dev: {
        files: {
          'theme/assets/css/post.css': 'theme/assets/css/post.scss',
          'theme/assets/css/screen.css': 'theme/assets/css/screen.scss'
        },
        options: {
          style: 'expanded',
          lineNumbers: true
        }
      }
    }
  });

  grunt.registerTask('default', [
    'sass:dev'
  ]);

  grunt.registerTask('build', [
    'sass:dist'
  ]);

  grunt.registerTask('init', function() {
    if (grunt.file.exists('theme/assets/css/screen.custom.scss') === false) {
      grunt.file.write('theme/assets/css/screen.custom.scss', '/* Put your custom SCSS in here. */');
    }
    if (grunt.file.exists('theme/assets/css/post.custom.scss') === false) {
      grunt.file.write('theme/assets/css/post.custom.scss');
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'sass:dev',
      'watch'
    ]);
  });
};

