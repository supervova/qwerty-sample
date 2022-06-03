# Разметка вкладок

```pug
//- `main` or `section`
main.tabs.is-smth-special

  //- Optional tabs container. Btw, W3C does not use nav for tabs
      https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-2/tabs.html
  .main__header.has-tabs
    //- The first level heading. It may be h1 or h2, depending on the structure
        of the page.
    h1 Vladimir Nikishin

    //- TABS
    ul.tabs__tablist(role='tablist')
      li.tabs__tab.active(role='presentation')
        a(href='#pane-01', aria-controls='pane-01', role='tab', data-toggle='tab') Pane 01
      li.tabs__tab(role='presentation')
        a(href='#pane-02', aria-controls='pane-02', role='tab', data-toggle='tab') Pane 02
      li.tabs__tab.dropdown(role='presentation', data-toggle='tooltip', title='More')
        a.dropdown-toggle#dropdown-01-more-label(href='#', data-toggle='dropdown', aria-controls='dropdown-01-more-contents', aria-expanded='false')
          +icon('more')
          span.sr-only More
        ul.dropdown-menu#dropdown-01-more-contents(aria-labelledby='dropdown-01-more-label')
          li(role='presentation')
            a(href='#pane-03', role='tab', data-toggle='tab', aria-controls='dropdown1', aria-expanded='false') Pane 03
          li(role='presentation')
            a(href='#pane-04', role='tab', data-toggle='tab', aria-controls='dropdown2', aria-expanded='false') Pane 04

  //- PANES
  .tabs__content
    section.tabs__pane.active#pane-01(role='tabpanel')
      h2.sr-only I prefer visible or invisible headings instead `aria-labelledby`
      p Lorem ipsum dolor.
    section.tabs__pane#pane-02(role='tabpanel')
      h2 Pane 02
      p Sit amet consectetur.
    section.tabs__pane#pane-03(role='tabpanel')
      h2.sr-only Pane 03
      p Adipisicing elit. Quam.
    section.tabs__pane#pane-04(role='tabpanel')
      h2 Pane 04
      p Hic corporis aperiam?
```
