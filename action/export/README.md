# Export Cursor Theme GitHub Action

This GitHub Action exports a cursor theme JSON file and SVG assets from a Figma file. Please refer to the full action declaration in the [action.yml](./action.yml) file for the most accurate and up-to-date information.

## Example usage

A workflow `export_theme.yml` that uses this action might look like this:

```yaml
on: workflow_dispatch

jobs:
  generate_cursor_theme_job:
    runs-on: ubuntu-latest
    name: Export latest cursor theme and assets from Figma file
    env:
      EXPORT_DIRECTORY: export
      OUTPUT_DIRECTORY: assets

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Export
        id: figma_export
        uses: phisch/cursor-theme-builder/action/export@v1.0
        with:
          access_token: ${{ secrets.FIGMA_ACCESS_TOKEN }}
          file_key: ${{ secrets.FIGMA_FILE_KEY }}
          theme_name: Your Cursor Theme Name
          theme_author: Your Name
          theme_comment: Describe your cursor theme here.
          output_directory: ${{ env.EXPORT_DIRECTORY }}

      - name: Update assets
        run: |
          rm -rf $OUTPUT_DIRECTORY
          mv $EXPORT_DIRECTORY $OUTPUT_DIRECTORY

      - name: Commit and push updated assets
        uses: EndBug/add-and-commit@v9
        with:
          add: ${{ env.OUTPUT_DIRECTORY }}
          default_author: github_actor
          message: 'exported assets from figma file ${{ secrets.FIGMA_FILE_KEY }} version ${{ steps.figma_export.outputs.version }}'
```

## Figma file

This exporter requires the used Figma file to follow some conventions.

The file needs to contain a **sprite component** with the following properties:

- **cursor** (string): the name of the cursor this sprite belongs to
- **variant** (string): the name of the variant this sprite belongs to

> [!NOTE]
> You can have sprites with different sizes that refer to the same `cursor` and `variant`. To ensure figma doesn't complain that there are non-unique variants, you can add a `size` property to the sprite. This property is not used by the exporter.

Each sprite variant can further contain JSON data to describe `aliases`, `flips` and `animations`. Select the sprite and click **Component configuration** and add the JSON to the **Description** field.

> [!TIP]
> I know this is scuffed, but it's the best you can do with Figma. You can use their **code-block** formatting to make the JSON more readable.

Here is an example containing `aliases`, `flips` and `animations`:

```json
{
	"aliases": ["foo", "bar"],
	"flips": ["svg", "#spinner"],
	"animations": [
		{
			"selector": "#spinner",
			"instructions": [
        {
          "name": "animate",
          "args": {
            "duration": 1500,
            "ease": "in-out-cubic"
          }
        },
        {
          "name": "rotate",
          "args": {
            "degrees": 720
          }
        }
      ]
		}
	]
}
```

### Example File

Check out the [example Figma file](https://www.figma.com/file/iaMgedqNuXPdzoLsG26jky) to see how the sprites are set up. You can also download a local copy of the file from [example-cursor-theme.fig](./example-cursor-theme.fig).
