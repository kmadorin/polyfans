/** @type {import('next').NextConfig} */
const withAntdLess = require('next-plugin-antd-less');
const withSass = require('@zeit/next-sass');

module.exports = withSass({
	cssModules: true,
	...withAntdLess({
		// optional: you can modify antd less variables directly here
		// modifyVars: { '@primary-color': '#04f' },
		// Or better still you can specify a path to a file
		lessVarsFilePath: './styles/variables.less',
		// optional
		lessVarsFilePathAppendToEndOfContent: false,
		// optional https://github.com/webpack-contrib/css-loader#object
		cssLoaderOptions: {},

		// Other Config Here...

		webpack(config) {
			return config;
		},

		// ONLY for Next.js 10, if you use Next.js 11, delete this block
		future: {
			webpack5: true,
		},
	})
});
