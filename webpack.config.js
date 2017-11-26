module.exports = [{
  output: {
    filename: './dist/background.js'
  },
  entry: './src/background.js',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}, {
  output: {
    filename: './dist/popup.js'
  },
  entry: './src/popup.js',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}, {
  output: {
    filename: './dist/settings.js'
  },
  entry: './src/settings.js',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}]
