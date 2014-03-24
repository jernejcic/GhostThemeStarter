module.exports = function(grunt) {
  var settings;
  var themeFolder;

  var defaultSettings = {
    'THEME_NAME': 'mytheme',
    'DISQUS_SHORTNAME': 'example',
    'GOOGLE_ANALYTICS_CODE': 'UA-XXXXXXX-XX',
    'GOOGLE_ANALYTICS_DOMAIN': 'example.com'
  };

  if (grunt.file.exists('theme/settings.json')) {
    settings = grunt.file.readJSON('theme/settings.json');

    if (typeof settings.THEME_FOLDER === 'undefined' || settings.THEME_FOLDER.length === 0) {
      settings.THEME_FOLDER = settings.THEME_NAME.replace(/[\W\.]+/g, "");
    }
    themeFolder = settings.THEME_FOLDER;

    settings.hasGoogleAnalytics = typeof settings.GOOGLE_ANALYTICS_CODE !== 'undefined'
        && settings.GOOGLE_ANALYTICS_CODE !== null
        && typeof settings.GOOGLE_ANALYTICS_DOMAIN !== 'undefined'
        && settings.GOOGLE_ANALYTICS_CODE !== defaultSettings.GOOGLE_ANALYTICS_CODE
        && settings.GOOGLE_ANALYTICS_DOMAIN !== defaultSettings.GOOGLE_ANALYTICS_DOMAIN;

    settings.hasDisqus = typeof settings.DISQUS_SHORTNAME !== 'undefined'
        && settings.DISQUS_SHORTNAME !== defaultSettings.DISQUS_SHORTNAME;
  }

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      create: {
        files: [
          {
            cwd: 'themebase',
            expand: true,
            src: ['**'],
            dest: 'theme/',
            filter: function(filepath) {
              var path = require('path');
              // Setup our target path.
              var dest = path.join(
                'theme',
                // Remove the parent source directory from filepath
                filepath.split(path.sep).slice(1).join(path.sep)
              );

              // Don't copy analytics partial if it is not setup in the settings.
              if (filepath.indexOf('partials/gauniversal.hbs') > -1
                  && !settings.hasGoogleAnalytics) {
                grunt.log.writeln('Skipping anlytics partials: not setup in the settings.json.');
                return false;
              }
              if (filepath.indexOf('partials/disqus.hbs') > -1
                  && !settings.hasDisqus) {
                grunt.log.writeln('Skipping Disqus partial: not setup in theme/settigns.json.');
                return false;
              }

              return !(grunt.file.exists(dest));
            }
          }
        ],
        options: {
          process: function(content, srcpath) {
            if (srcpath.indexOf('partials/gauniversal.hbs') > -1) {
              grunt.log.writeln('Processing file: ' + srcpath);
              return content
                  .replace('[GOOGLEANALYTICSCODE]', settings.GOOGLE_ANALYTICS_CODE)
                  .replace('[GOOGLEANALYTICSDOMAIN]', settings.GOOGLE_ANALYTICS_DOMAIN);
            }
            if (srcpath.indexOf('partials/disqus.hbs') > -1) {
              grunt.log.writeln('Processing file: ' + srcpath);
              return content
                  .replace('[DISQUSSHORTNAME]', settings.DISQUS_SHORTNAME);
            }

            return content;
          }
        }

      },
      dist: {
        files: [
          {
            expand: true,
            src: 'theme/**',
            dest: themeFolder
          }
        ]
      }
    },
    sass: {
      dist: {
        files: {
          'theme/assets/css/post.css': 'theme/assets/css/post.scss',
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
    },
    watch: {
      sass: {
        files: ['hover/assets/css/*.scss'],
        tasks: ['sass:dev'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', function() {
    grunt.log.writeln('Main commands:');
    grunt.log.writeln('  grunt init      Creates a settings file for setting up your theme configuration');
    grunt.log.writeln('  grunt create    Creates the theme work area');
    grunt.log.writeln('  grunt build     Creates you theme in a distributable format with compressesd CSS & HTML');
    grunt.log.writeln('');
    grunt.log.writeln('View the README.md for more info.');
  });

  grunt.registerTask('build', [
    'sass:dist',
    'copy:dist'
  ]);

  grunt.registerTask('init', function() {
    if (grunt.file.exists('theme') === false) {
      grunt.log.writeln('Creating `theme` folder.');
      grunt.file.mkdir('theme');
    } else {
      grunt.log.writeln('Skipping creating `theme` folder (already exists).');
    }

    if (grunt.file.exists('theme/settings.json') === false) {
      grunt.log.writeln('Creating `theme/settings.json`.');
      grunt.file.copy('settings.example.json', 'theme/settings.json');
    } else {
      grunt.log.writeln('Skipping creating `settings.json` file (already exists).');
    }
  });

  grunt.registerTask('checkReadyForCreate', function() {
    // Test to make sure that we have the settings we need.
    if (typeof settings === 'undefined' || settings === null) {
      grunt.fatal('`grunt init` must be run before trying to create the theme.');
    }

    if (typeof settings.THEME_NAME === 'undefined'
        || settings.THEME_NAME === defaultSettings.THEME_NAME) {
      grunt.fatal('You must give your theme a name to create it. Set your theme name in theme/settings.json.');
    }
  });

  grunt.registerTask('create', [
    'checkReadyForCreate',
    'copy:create'
  ]);

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'sass:dev',
      'watch'
    ]);
  });
};

