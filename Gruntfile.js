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
          'hover/assets/css/screen.css': 'hover/assets/css/screen.scss'
        },
        options: {
          style: 'compressed'
        }
      },
      dev: {
        files: {
          'hover/assets/css/screen.css': 'hover/assets/css/screen.scss'
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

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'sass:dev',
      'watch'
    ]);
  });
};

