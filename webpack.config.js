const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
	entry: {
		app: './src/root.js'
	},
	devtool: 'inline-source-map',
	devServer: {
	     contentBase: './dist',
		 hot: true
   	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	plugins: [
		//new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			title: 'LinkBoard'
		}),
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
   ],
	node: {
		dns: 'empty',
		fs: 'empty',
		net: 'empty',
		tls: 'empty'
	},
	module: {
	     rules: [
			 {
				 test: /\.css$/,
	         	use: ['style-loader', 'css-loader']
       		},
		   {
			 test: /\.(png|svg|jpg|gif)$/,
	         use: [
	           'file-loader'
	       	 ]
       	   },
		   {
			 test: /\.(woff|woff2|eot|ttf|otf)$/,
	         use: [
	           'file-loader'
	         ]
       	   },
		   {
			 test: /\.(csv|tsv)$/,
	         use: [
	          'csv-loader'
	         ]
      	   },
      	   {
        	test: /\.xml$/,
	        use: [
	          'xml-loader'
	        ]
      		}
     	]
   }
};