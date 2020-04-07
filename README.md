# @aimee.gm/responsive

Auto generate multiple resized images for responsive use with a simple CLI command. Also comes with a CLI tool to verify images have been resized (useful for CI) and handy methods for creating [eleventy](https://11ty.dev) shortcodes.

- [@aimee.gm/responsive](#aimeegmresponsive)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Configuration](#configuration)
    - [Resize images](#resize-images)
    - [Check resized images](#check-resized-images)
    - [shortcode()](#shortcode)
    - [responsiveImages()](#responsiveimages)
  - [Configuration](#configuration-1)
    - [File format](#file-format)
    - [Options](#options)
      - [srcDir](#srcdir)
      - [outDir](#outdir)
      - [sizes](#sizes)
      - [ext](#ext)
      - [srcRewrite](#srcrewrite)
      - [defaultSize](#defaultsize)

## Installation

```
yarn add @aimee.gm/responsive
```

## Usage

### Configuration

Create a `.responsiverc.yml` file in the root of your project.

Example:

```yaml
srcDir: site/assets/images/originals
outDir: site/assets/images/photos
srcRewrite: assets/images/photos
sizes:
  - 400
  - 800
```

See [Configuration](#Configuration) for a detailed description.

### Resize images

Run `yarn resize-images` or `npx resize-images`. Resizes images found in `srcDir` and outputs them, reamed to `outDir` in `sizes`.

### Check resized images

Run `yarn verify-resized-images` or `npx verify-resized-images`. Verifies images found in `srcDir` have been correctly resized and reamed to `outDir` in `sizes`. Useful for CI.

### shortcode()

`shortcode(sizes: string[]): (src: string, alt: string, options: { class?: string } = {}) => string`

Returns an function that can be used as an eleventy shortcode. Accepts the following arguments:

- `src`: `string` (required) the path to the un-resized image file. The URL path will be modified using the `srcRewrite` configuration option.
- `alt`: `string` (required) the alt text for the image
- `options`: `object` (optional)
  - `class` (optional) class to apply to the generated image element.

Example:

```javascript
const { shortcode } = require("@aimee.gm/responsive");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode(
    "responsive",
    shortcode([
      "(min-width: 1025px) 864px",
      "(min-width: 768px) 736px",
      "(min-width: 645px) 608px",
      "100vw",
    ])
  );
};
```

And use with nunjucks:

```nunjucks
{% responsive image.url, image.alt, { class: "my-custom-class" } %}
```

### responsiveImages()

`responsiveImages(filepath: string): { src: string, srcset: string }`

Returns an object with `src` and `srcset` attributes for a responsive `<img>` tag. `filepath` should be the path to the **original** image, relative to your project root. The `src` will be modified using the `srcRewrite` configuration option. Suitable for more control over how markup is rendered.

Example:

```javascript
const { responsiveImages } = require("@aimee.gm/responsive");

module.exports = function (eleventyConfig) {
  eleventyConfig.addShortcode("responsive", (filepath, alt) => {
    const { src, srcset } = responsiveImages(filepath);
    return `<img src="${src}" srcset="${srcset}" sizes="100vw" alt="${alt}">`;
  });
};
```

## Configuration

### File format

The confiruration file can be one of:

- `.responsiverc` (json)
- `.responsiverc.json`
- `.responsiverc.yaml`

### Options

#### srcDir

Location of original images to resize, relative path from configuration file. Search is recursive.

#### outDir

Location of folder to save resized images, relative path from configuration file.

#### sizes

Array of sizes to resize to. Defaults to `[400, 800, 1600]`

#### ext

Array of file extensions to match for files to resize. Defaults to `["jpg", "jpeg", "png"]`

#### srcRewrite

Path to use for `<img>` when using `responsiveImages()` to resolve a full-size image path to the resized files. Defaults to `outDir`

#### defaultSize

Default size to use for creating the `src` attribute with `responsiveImages()` and `shortcode()`. Defaults to the largest resized image.
