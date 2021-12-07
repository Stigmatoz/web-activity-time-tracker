const path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

const modulesDir = path.join(__dirname, '..', 'modules');

module.exports = {
	entry: {
		popup: path.join(`${modulesDir}/popup`, 'popup.tsx'),
		options: path.join(`${modulesDir}/options`, 'options.tsx'),
		background: path.join(`${modulesDir}/background`, 'background.ts'),
		content_script: path.join(`${modulesDir}/content_script`, 'content_script.tsx'),
	},
	output: {
		path: path.join(__dirname, '../dist/js'),
		filename: '[name].js',
	},
	optimization: {
		splitChunks: {
			name: 'vendor',
			chunks(chunk) {
				return chunk.name !== 'background';
			},
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: '.', to: '../', context: 'public' }],
			options: {},
		}),
	],
};
