# Tag

https://component.gallery/components/badge/ (Закончил на IBM Carbon, включительно)
https://material.io/components/chips

Tags are compact elements that label UI objects and allow users filter content, enter information, or trigger actions.

## Basic Usage

Default tags are a means of classifying content, typically using keywords. They are added to a content to help users search for and find related content quickly and easily.

Use tags when content is mapped to multiple categories, and the user needs a way to differentiate between them.

## Filter Tags

Tags can also be used as a method of filtering data, to show only items within that particular category.

## Notification Tags

Tags can be used as part of links or buttons to provide a counter.

```pug
a(href='#')
  | Profile
  span.tag.is-important 9
  span.sr-only unread messages
```

## Action tags

```pug
a(href='#', role='button').tag Foo
```

- Unlike buttons, action tags should appear dynamically as a group of multiple interactive elements.
- Action tag gets the role button and is focusable.
- It can be clicked by pressing enter.

## Removable tags

Tags can be removable (by displaying the remove icon).

```pug
span.tag.is-success
  | Bar
  button.delete.is-small(type='button')
```

## List of tags

We can create a list of tags with the tags container.

```pug
ul.tags
  li:span.tag Foo
  li:span.tag Bar
  li:span.tag Baz
  li:span.tag Quux
```

## Other options

- A tag can include an icon or image, such as an avatar.
- Input tag can be closed by pressing backspace or delete.

## Best practices

- Use short labels for easy scanning. Use two words only if necessary to describe the status and differentiate it from other tags.
- Custom color tags can be used to organize a large amount of content.
- But tags can increase the amount of visual noise on a screen, so use them in moderation.
- Using colour to add meaning only provides a visual indication, which will not be conveyed to users of assistive technologies such as screen readers. Unless the context is clear (as with the “Notifications” example, where it is understood that the “4” is the number of notifications), consider including additional context with a visually hidden additional text with the .sr-only class.
- Tags scale to match the size of the immediate parent element by using relative font sizing and em units.

## Additional considerations

## Playground

[Actionable tags](https://codesandbox.io/s/actionable-tags-qxqyj?file=/index.js)
