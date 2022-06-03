# Разметка окна

```pug
button.btn(type='button', data-toggle='modal', data-target='#myModal').
  Launch

.modal.fade#myModal(tabindex='-1', role='dialog')
  .modal-dialog(role='document')
    .modal__box
      .modal__header
        h2.modal__title Modal title
        button.btn.is-close(type='button', data-dismiss='modal', aria-label='Close')
          +icon('x-mark')
      .modal__body
        p One fine body…
      .modal__footer
        button.btn(type='button') Done!
```
