# Build Cursor Theme GitHub Action

This GitHub Action takes a cursor theme JSON file and SVG assets and builds a cursor theme from them. Please refer to the full action declaration in the [action.yml](./action.yml) file for the most accurate and up-to-date information.

## Example usage

A workflow `build_theme.yml` that uses this action might look like this:

```yaml
on: workflow_dispatch

jobs:
  build_cursor_theme:
    runs-on: ubuntu-latest
    name: Build cursor theme

    env:
      ARCHIVE_NAME: example-cursors-variants.tar.bz2
      BUILD_DIRECTORY: build

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Build
        uses: phisch/cursor-theme-builder/action/build@master
        with:
          cursor_theme_json: assets/cursor-theme.json
          output_directory: ${{ env.BUILD_DIRECTORY }}/themes

      - name: Create artifact
        working-directory: ${{ env.BUILD_DIRECTORY }}
        run: tar -cjf ${{ env.ARCHIVE_NAME }} -C themes .

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${{ env.ARCHIVE_NAME }}
          path: ${{ env.BUILD_DIRECTORY }}/${{ env.ARCHIVE_NAME }}

      - name: Draft Release
        uses: softprops/action-gh-release@v2
        with:
          files: ${{ env.BUILD_DIRECTORY }}/${{ env.ARCHIVE_NAME }}
          draft: true
          tag_name: ${{ steps.figma_cursor_theme.outputs.version }}
```