module.exports = {
  target: 'webworker',
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'worker.js',
    path: __dirname + '/dist',
  },
  optimization: {
    minimize: false
  },
  performance: {
    hints: false,
  },
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    },
  },
};
