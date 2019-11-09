# @aimee.gm/responsive

Auto generate multiple resized images for responsive use

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
sizes:
  - 400
  - 800
srcRewrite: /assets/images/photos
```

See [Configuration](#Configuration) for a detailed description.

### Resize images

Run `yarn resize-images` or `npx resize-images`. Resizes images found in `srcDir` and outputs them, reamed to `outDir` in `sizes`.

### Check resized images

Run `yarn verify-resized-images` or `npx verify-resized-images`. Verifies images found in `srcDir` have been correctly resized and reamed to `outDir` in `sizes`. Useful for CI.

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

Path to use for `<img>` when using `replaceImgSrc()` (currently undocumented) to convert `src` to `srcset`.
