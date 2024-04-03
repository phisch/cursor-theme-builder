# Validate Cursor Theme GitHub Action

This GitHub Action validates a cursor theme JSON against the schema. Please refer to the full action declaration in the [action.yml](./action.yml) file for the most accurate and up-to-date information.

## Example

A workflow `validate_theme.yml` that uses this action might look like this:

```yaml
on: workflow_dispatch

jobs:
  validate_cursor_theme:
    runs-on: ubuntu-latest
    name: Validate a cursor-theme.json file
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Validate
        id: figma_export
        uses: phisch/cursor-theme-builder/action/validate@master
        with:
          cursor_theme_json: './assets/cursor-theme.json'
```

