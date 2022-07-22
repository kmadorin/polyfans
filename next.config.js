/** @type {import('next').NextConfig} */
const withAntdLess = require('next-plugin-antd-less');

module.exports = {
	experimental: { images: { layoutRaw: true } },
	...withAntdLess({
	// optional: you can modify antd less variables directly here
	// modifyVars: { '@primary-color': '#04f' },
	// Or better still you can specify a path to a file
	lessVarsFilePath: './src/styles/variables.less',
	// optional
	lessVarsFilePathAppendToEndOfContent: false,
	// optional https://github.com/webpack-contrib/css-loader#object
	cssLoaderOptions: {},

	// Other Config Here...

	webpack(config) {
		return config;
	},

	localIdentName: '[hash:2]',
})};
