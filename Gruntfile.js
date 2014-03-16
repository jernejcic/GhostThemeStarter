module.exports = function(grunt) {
  var settings;
  if (grunt.file.exists('theme/settings.json')) {
    settings = grunt.file.readJSON('theme/settings.json');
  }
  var defaultSettings = {
    'THEME_NAME': 'mytheme',
    'DISQUS_SHORTNAME': 'example',
    'GOOGLE_ANALYTICS_CODE': 'UA-XXXXXXX-XX',
    'GOOGLE_ANALYTICS_DOMAIN': 'example.com'
  };

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

  grunt.registerTask('default', function() {
    grunt.log.writeln('Main commands:');
    grunt.log.writeln('  grunt init      Creates a settings file for setting up your theme configuration');
    grunt.log.writeln('  grunt create    Creates the theme work area');
    grunt.log.writeln('  grunt build     Creates you theme in a distributable format with compressesd CSS & HTML');
    grunt.log.writeln('');
    grunt.log.writeln('View the README.md for more info.');
  });

  grunt.registerTask('build', [
    'sass:dist'
  ]);

  grunt.registerTask('init', function() {
    if (grunt.file.exists('theme') === false) {
      grunt.log.writeln('Creating `theme` folder.');
      grunt.file.mkdir('theme');
    } else { grunt.log.writeln('Skipping creating `theme` folder (already exists).'); }

    if (grunt.file.exists('theme/settings.json') === false) {
      grunt.log.writeln('Creating `theme/settings.json`.');
      grunt.file.copy('settings.example.json', 'theme/settings.json');
    } else { grunt.log.writeln('Skipping creating `settings.json` file (already exists).'); }
  });

  grunt.registerTask('create', function() {
    // Test to make sure that we have the settings we need.
    if (typeof settings === 'undefined' || settings === null) {
      grunt.fatal('`grunt init` must be run before trying to create the theme.');
    }
    if (typeof settings.THEME_NAME === 'undefined' || settings.THEME_NAME === settingsDefault.THEME_NAME) {
      grunt.fatal('You must give your theme a name to create it. Set your theme name in theme/settings.json.');
    }

    if (grunt.file.exists('theme/partials/analytics.hbs') === false
        && typeof settings.GOOGLE_ANALYTICS_CODE !== 'undefined'
        && typeof settings.GOOGLE_ANALYTICS_DOMAIN !== 'undefined'
        && settings.GOOGLE_ANALYTICS_CODE !== settingsDefault.GOOGLE_ANALYTICS_CODE
        && settings.GOOGLE_ANALYTICS_DOMAIN !== settingsDefault.GOOGLE_ANALYTICS_DOMAIN) {
      grunt.log.writeln('Creating partial for Google Analytics.');
      grunt.file.write('theme/partials/analytics.hbs',
        '<script>' +
        '  (function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){' +
        '    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),' +
        '    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)' +
        '  })(window,document,"script","//www.google-analytics.com/analytics.js","ga");' +

        '  ga("create", "' + settings.GOOGLE_ANALYTICS_CODE +'", "' + settings.GOOGLE_ANALYTICS_DOMAIN +'");' +
        '  ga("send", "pageview");' +

        '</script>'
      );
    } else { grunt.log.writeln('Skipping Google Analytics partial creation.'); }

    if (grunt.file.exists('theme/partials/disqus.hbs') === false
        && typeof settings.DISQUS_SHORTNAME !== 'undefined'
        && settings.DISQUS_SHORTNAME !== settingsDefault.DISQUS_SHORTNAME) {
      grunt.log.writeln('Creating partial for Disqus comments');
      grunt.file.write('theme/partials/disqus.hbs',
        '<script type="text/javascript">' +
        'var disqus_shortname = "' + settings.DISQUS_SHORTNAME + '";' +
        '(function() {' +
        '  var dsq = document.createElement("script"); dsq.type = "text/javascript"; dsq.async = true;' +
        '  dsq.src = "//" + disqus_shortname + ".disqus.com/embed.js";' +
        '  (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(dsq);' +
        '})();' +
        '</script>' +
        '<noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>' +
        '<a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>'
      );
    } else { grunt.log.writeln('Skipping Disqus partial creation.'); }
  });

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'sass:dev',
      'watch'
    ]);
  });
};

