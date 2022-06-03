# Сайт Академии здорового долголетия
### Инфографика результатов теста


## Разметка

```pug
header.header#header
  .header__container

// .navbar

.main#main
  .main__container
    .main__header
      h1.main__title
      .main__byline
        .main__avatar
        time.main__date
    .main__body

    section.main__comments

    .main__tools
      .main__rating
      .main__donate
      button.main__abuse
      .main__more
        //-translation etc

footer.footer#footer
  .footer__container
    //- Языки
    ul.languages

    //- Мета-навигация
    .footer__doormat

    p.footer__site-credits

.modal.fade#editcomment
.modal#newpicture
```

