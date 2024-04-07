# Cursor Theme Builder

Contains a JSON schema that describes a cursor theme, its variants, cursors, sprites, animations and more, and GitHub Actions to validate, export a JSON following this schema from a Figma file, and a builder that takes a JSON and SVG assets and builds a cursor theme from it.

## Schema

The schema can be used to create a valid cursor theme JSON file. Modern editors can use it to provide autocompletion and validation. All that is needed is to reference the schema in the JSON file like this:

```json
{
  "$schema": "https://phisch.github.io/cursor-theme-builder/schemas/CursorTheme.json",
  "name": "My Cursor Theme",
  "variants": [ ... ]
}
```

## Variants

Each cursor theme definition can contain multiple root and child variants. A variant is built into a functioning base cursor theme. A child variant defines its parent variant as the inheritance source. This way, a child variant can override the parent variant's properties.

This would allow to create a base cursor theme, that has a variant, which adds animations on top.

## Left handed cursors

Each sprite allows you to define "flips". A flip is a `css selector` that selects elements from the sprites SVG and flips all of them horizontally.

Each selected element is flipped around its bounding box's center, except for the special `svg` selector, which flips the whole SVG around its center.

## Animations

This project uses [SVG.js](https://svgjs.dev/docs/3.0/) to animate cursor sprites. The JSON schema provides a shallow abstraction that allows to select elements from the SVG and call SVG.js functions on them.

> [!WARNING]
> The TypeScript types for SVG.js are not perfect, and have proven to be a bit buggy. I don't intend in fixing this, which means that the animations are a bit limited, or some instructions might not work as expected.

There is also a sub-schema for animations, which is available at `https://phisch.github.io/cursor-theme-builder/schemas/Animations.json`.

You can use the [web interface](https://phisch.github.io/cursor-theme-builder/) to create animations. It supports auto-completion and validation, and updates the animated cursor in real-time.
Drag and drop a SVG file on top of the animated cursor to replace the loaded one.

## Aliases

Aliases are a way to define multiple names for a cursor. Due to cursor themes history, many applications expect a cursor to have a specific name. Aliases allow you to define multiple names for a cursor, so it can be used in more applications.

## GitHub Actions

Thre are 3 GitHub Actions in this repository, each of them has its own documentation:

- [validate](./action/validate/README.md): Validates a cursor theme JSON file against the schema
- [export](./action/export/README.md): Exports a JSON file and SVG assets from a particular Figma file
- [build](./action/build/README.md): Builds a cursor theme from a JSON file and SVG assets

### Desktop Makers

<a href="https://discord.gg/RqKTeA4uxW" title="Desktop Makers Discord"><img align="left" width="72" alt="type=discord" src="https://user-images.githubusercontent.com/1282767/161089772-d7ad28bf-76eb-4951-b0f0-985afd5ea57a.png"></a>

I am actively working on this and other cool projects on the [Desktop Makers Discord](https://discord.gg/RqKTeA4uxW). It aims to be a community for communities of Linux desktop related projects. If you want to share your projects progress, collaborate with, or contribute to great projects, this might be the right place for you.
