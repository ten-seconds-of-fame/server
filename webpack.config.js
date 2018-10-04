var path = require('path');
const webpackNodeExternals = require('webpack-node-externals');

// changed from export default
module.exports = {
  target:'node',
  entry:'./index.js',
  output:{
    filename:'bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  mode:'production',
  module:{
    rules:[
      {
        use: 'babel-loader',
        test:/\.js$/,
        exclude:/node_modules/
      }
    ]
  },
  plugins:[],
  externals:[webpackNodeExternals()]
};