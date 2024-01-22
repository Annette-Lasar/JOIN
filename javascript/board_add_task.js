function adaptOverlayToScreenSize() {
  const addTaskOverlayContainer = document.getElementById('add_task_overlay');
  const bigScreenContainer = document.getElementById('big_screen');
  const maxWidth = addTaskOverlayContainer.offsetWidth;
  console.log('maximale Breite: ', maxWidth);
  if (maxWidth < 650) {
    bigScreenContainer.classList.add('d-none');
  } else {
    bigScreenContainer.classList.remove('d-none');
  }
}

window.addEventListener('resize', function() {
  adaptOverlayToScreenSize();
});