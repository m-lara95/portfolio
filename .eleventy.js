module.exports = function (eleventyConfig) {
  // Copy the stylesheet straight through to the built site.
  eleventyConfig.addPassthroughCopy("src/styles.css");

  // A "collection" is just a named list Eleventy builds for us — here, every
  // project page, sorted by an optional `order` field (lowest first).
  eleventyConfig.addCollection("projects", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("src/projects/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
