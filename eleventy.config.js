import path from "node:path";
import {
	InputPathToUrlTransformPlugin,
	HtmlBasePlugin,
	IdAttributePlugin,
} from "@11ty/eleventy";
import pluginNavigation from "@11ty/eleventy-navigation";
import { eleventyImageTransformPlugin, Image } from "@11ty/eleventy-img";
import pluginFilters from "./_config/filters.js";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default async function (eleventyConfig) {
	// Drafts, see also _data/eleventyDataSchema.js

	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy("./content/css/");
	eleventyConfig.addPassthroughCopy("./content/img/");

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpg,jpeg,gif}");

	// Official plugins
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

	// Image optimization: https://www.11ty.dev/docs/plugins/image/#eleventy-transform
	eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// Output formats for each image.
		formats: ["avif", "webp", "png", "jpeg"],
		outputDir: "/optimized/",
		widths: ["auto"],
		failOnError: false,
		htmlOptions: {
			imgAttributes: {
				// e.g. <img loading decoding> assigned on the HTML tag will override these values.
				loading: "lazy",
				decoding: "async",
			},
		},

		sharpOptions: {
			animated: true,
		},
	});

	// eleventyConfig.addAsyncShortcode("image", async (srcFilePath, alt, sizes) => {
	// 	// Make the image relative to the input directory
	// 	let inputFilePath = path.join(eleventyConfig.dir.input, srcFilePath);

	// 	let metadata = await new Image(inputFilePath, {
	// 		widths: [400, 800, 1600],
	// 		formats: ["avif", "webp", "svg", "jpeg"],
	// 		outputDir: "./optimized/",
	// 		urlPath: "/optimized/",
	// 		svgShortCiruit: "size",
	// 		// svgCompressionSize: "br",
	// 	});

	// 	console.log({
	// 		metadata,
	// 		alt,
	// 		sizes,
	// 		loading: "eager",
	// 		decoding: "async",
	// 	});
	// });

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	eleventyConfig.addPlugin(IdAttributePlugin, {
		// by default we use Eleventy’s built-in `slugify` filter:
		slugify: eleventyConfig.getFilter("slugify"),
		selector: "h1,h2,h3,h4,h5,h6", // default
	});

	eleventyConfig.addShortcode("currentBuildDate", () => {
		return new Date().toISOString();
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
}

export const config = {
	// Control which files Eleventy will process
	// e.g.: *.md, *.njk, *.html, *.liquid
	templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],

	// Pre-process *.md files with: (default: `liquid`)
	markdownTemplateEngine: "njk",

	// Pre-process *.html files with: (default: `liquid`)
	htmlTemplateEngine: "njk",

	// These are all optional:
	dir: {
		input: "content", // default: "."
		includes: "../_includes", // default: "_includes" (`input` relative)
		data: "../_data", // default: "_data" (`input` relative)
		output: "public",
		pathPrefix: "/portfolio",
	},
};
