module.exports = function (eleventyConfig) {
  // Copy the stylesheet and client-side JS straight through to the built site.
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/js");

  // Emit an empty .nojekyll so GitHub Pages serves the files as-is
  // (skips its legacy Jekyll processing). Reproduced on every build.
  eleventyConfig.addPassthroughCopy({ "src/nojekyll": ".nojekyll" });

  // A "collection" is just a named list Eleventy builds for us — here, every
  // project page, sorted by an optional `order` field (lowest first).
  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  return {
    // The site is served from the /portfolio/ subfolder on GitHub Pages.
    // The `url` filter below uses this to build correct links. If you ever
    // move to a custom domain served at the root, change this to "/".
    pathPrefix: "/portfolio/",
    dir: {
      input: "src",
      includes: "_includes",
      output: "docs",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
