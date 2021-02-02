module.exports = {
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: [
            'node_modules/breakpoint-sass/stylesheets',
            'node_modules/susy/sass',
            'node_modules/gent_styleguide/build/styleguide/sass'
          ]
        }
      }
    }
  }
}
