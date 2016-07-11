module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      main: {
        options: {
          preserveComments: 'some'
        },
        files: {
          'dist/ng-stomp.min.js': ['src/ng-stomp.js'],
          'dist/ng-stomp.standalone.min.js': [
            'bower_components/sockjs-client/dist/sockjs.min.js',
            'bower_components/stomp-websocket/lib/stomp.min.js',
            'src/ng-stomp.js'
          ]
        }
      }
    },
    standard: {
      options: {
        format: true
      },
      app: {
        src: ['ng-stomp.js']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.registerTask('default', ['uglify'])
}
