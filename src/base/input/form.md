# Форма
## Классы компонентов

Так как ввод данных в современных веб-интерфейсах не ограничивается традиционными формами, используем семантически корректные названия.

- `form` и `filter`
- `form__item` и `filter__item`
- `form__row` и `filter__row`
- и т. д.

### Переименовать

TODO:
.form-control ➜ ''
.form__fieldset ➜ ''
.form__item ➜ .form__item
.form__item-controls ➜ .form__controls
.form__legend ➜ ''
.form__row.is-solid ➜ .form__row
.input ➜ .form__item
.input-group ➜ .form__item
.input-group-addon ➜ label.form__label.is-left
.input.has-option ➜ .form__item.has-option
.input.has-option ➜ .form__item.has-option
.input__alert ➜ .form__alert
.input__control ➜ ''
.input__control.is-full-file-input ➜ ''
.input__field ➜ ''
.input__field ➜ ''
.input__group ➜ .form__item
.input__hint ➜ .form__hint
.input__label ➜ ''
.input__option ➜ ''
.input__options ➜ .form__options
.is-select ➜ ''
.is-textarea ➜ ''

## Разметка

См. также:

- [`WTF, forms?`](http://wtfforms.com/). Стилизация сложных для CSS полей формы: чекбоксов, радиокнопок, загрузки файлов. Проект Марка Отто.
- [The Cleanest Trick for Autogrowing Textareas](https://css-tricks.com/the-cleanest-trick-for-autogrowing-textareas/)

### Поле на всю ширину формы

```pug
//- Full width input

.form__item
  label(for='form-my-input') Label
  input#form-my-input(name='name' type='text' placeholder='Label')
  .form__alert(role='alert') Message

.form__item
  label(for='form-my-email') * Label:
  input#form-my-email(name='email' inputmode='email' type='email' required)

.form__item
  label(for='form-my-textarea') * Label
  textarea#form-my-textarea(name='comment' required)
    | Placeholder
  .form__alert(role='alert') Message
```

### Несколько полей в ряд

```pug
.form__row
  .form__item
    +formItem('Caption', 'my-name', 'text', false, 'Message')(required=true)
  .form__item
    //- etc
```

### Социальная авторизация

```pug
p Continue with your social network or messenger account:

ul.buttons.is-social-login
  li
    +button('Facebook', 'brand-facebook', 'is-icon is-ghost', true)(onclick='facebookoauth()')
  li
    +button('Google', 'brand-google', 'is-icon is-ghost', true)(onclick='googleoauth()')
  li
    +button('Facebook', 'brand-yandex', 'is-icon is-ghost', true)(onclick='yandexoauth()')
  li
    +button('Facebook', 'brand-telegram', 'is-icon is-ghost', true)(onclick='preloginmsg(\'telegram\')')
  li
    +button('Facebook', 'brand-viber', 'is-icon is-ghost', true)(onclick='preloginmsg(\'viber\')')
```

// wtfforms.com — Mark Otto ide project, form controls customization
// css-tricks.com/the-cleanest-trick-for-autogrowing-textareas

### Атрибут `inputmode`

Используется для выбора подходящей клавиатуры на мобильных устройствах.

```html
<input type="text" inputmode="url">
<input type="text" inputmode="email">
<input type="text" inputmode="search">
<input type="text" inputmode="numeric">
<input type="text" inputmode="tel">
```

Клавиатура для значения `inputmode="decimal"` почти идентична клавиатуре для `inputmode="tel"`. Но вместо клавиши `+*#` появляется клавиша десятичной точки (для англоязычного формата дробей).

```html
<input type="text" inputmode="decimal">
```

### Всё вместе: основные типы полей, валидация с «регулярками»

```pug
form#form-needs-validation(action='/', method='post', novalidate)
  input(type='hidden', name='my-hidden-stuff', value='')

  .form__item
    +formItem('Name', 'name', 'text', false, 'Message')(value='', maxlength='128', pattern='[A-Za-z -]+', required=true)

  .form__item
    +formItem('Email', 'email', 'email', false, 'Message')(inputmode='email', value='', maxlength='128', required=true)

  .form__row
    .form__item.col-4
      +formItem('Country code', 'country-code', 'text', false, 'Message')(inputmode='numeric', value='', maxlength='3', pattern='\d{3}', required=true)

    .form__item.col-8
      +formItem('Phone number', 'phone', 'text', false, 'Message')(inputmode='numeric', value='', maxlength='9', pattern='\d{8,9}', required=true)

  .form__item
    label(for='form-state') State
    select#form-state(name='state')
      option(value='AL') Alabama
      option(value='AK') Alaska
      option(value='AZ') Arizona

  .form__item.has-option
    input#form-terms(type='checkbox', name='terms', required)
    label(for='form-terms')
      | You agree to our
      a(href='', target='_blank', rel='noopener noreferrer') Terms
    .form__alert(role='alert') Message

  button#form-submit.btn.is-submit(type='submit') Sign Up
    svg.spinner.is-sm(xmlns='http://www.w3.org/2000/svg', viewbox='0 0 48 48')
      circle.spinner__circle(cx='24', cy='24', r='20')
```
