# «Раскрывашка»

## Стандартная разметка

```pug
details.accordion(open)
  summary.accordion__header Title
    small Subtitle in filters

  .accordion__body.
    Lorem ipsum dolor sit amet consectetur adipisicing elit.

details.accordion
  summary.accordion__header Title
    small Subtitle in filters

  .accordion__body.
    Eligendi minima consectetur nobis!
```

## Вариант Bootstrap'а

Используется там, где кнопка вынесена за пределы содержательного блока — например, в дополнительных настройках.

TODO: заменить пользовательским скриптом для частных случаев в editpost.twig и userpage.twig

```pug
h3.collapse-title.mt-1#collapse-advanced-title(role='button' data-toggle='collapse' href='#collapse-advanced' aria-controls='collapse-advanced' aria-expanded='false')
  | Advanced settings
  +icon('chevron-down-sm', 'is-sm')

section.collapse#collapse-advanced(aria-labelledby='collapse-advanced-title')
  Lorem ipsum dolor sit.
```
