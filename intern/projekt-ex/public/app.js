const supportsCommand = 'commandForElement' in HTMLButtonElement.prototype;

if (!supportsCommand) {
  for (const button of document.querySelectorAll('button[command="show-modal"]')) {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.getAttribute('commandfor'));
      dialog?.showModal();
    });
  }
  for (const button of document.querySelectorAll('button[command="close"]')) {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  }
}

if (!('closedBy' in HTMLDialogElement.prototype)) {
  const outside = (event, dialog) => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (event) => { pressedOutside = outside(event, dialog); });
    dialog.addEventListener('pointerup', (event) => {
      if (pressedOutside && outside(event, dialog)) dialog.close();
    });
  }
}
