const buttons = document.querySelectorAll('.ai-buttons button');
const yesButton = document.getElementById('yesButton');
const noButton = document.getElementById('noButton');

buttons.forEach(button => {
  button.addEventListener('click', function() {
    // Remove the active class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add the active class to the clicked button
    this.classList.add('active');

    // Adjust the flex values as needed
    if (this.id === 'yesButton') {
      yesButton.style.flex = `calc(0.6 + var(--_s, 0))`;
      noButton.style.flex = `calc(0.48 + var(--_s, 0))`;
    } else {
      yesButton.style.flex = `calc(0.48 + var(--_s, 0))`;
      noButton.style.flex = `calc(0.6 + var(--_s, 0))`;
    }
  });
});