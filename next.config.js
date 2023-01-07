/** @type {import('next').NextConfig} */
const withAntdLess = require('next-plugin-antd-less');

module.exports = {
	experimental: {images: {layoutRaw: true}},
	exportPathMap: async function (
		defaultPathMap,
		{dev, dir, outDir, distDir, buildId}
	) {
		return {
			'/': {page: '/'},
			'/404': {page: '/404'},
			'/500': {page: '/500'},
			'/u/kmadorin': {page: '/u', query: {username: 'kmadorin'}},
			'/u/kmadorin1': {page: '/u', query: {username: 'kmadorin1'}},
		}
	},
	typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
	images: {
		loader: "akamai",
		path: "",
	},
	trailingSlash: false,
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
	})
};
