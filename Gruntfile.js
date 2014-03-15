module.exports = function(grunt) {
  var settings = grunt.file.readJSON('settings.json');

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
    if (grunt.file.exists('theme/partials/analytics.hbs') === false
        && typeof settings.GOOGLE_ANALYTICS_CODE !== 'undefined'
        && typeof settings.GOOGLE_ANALYTICS_DOMAIN !== 'undefined') {
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
    }
    if (grunt.file.exists('theme/partials/disqus.hbs') === false && typeof settings.DISQUS_SHORTNAME !== 'undefined') {
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
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'sass:dev',
      'watch'
    ]);
  });
};

