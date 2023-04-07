const themeToggle = document.querySelector('#theme-toggle');
const body = document.querySelector('body');
const lightThemeClass = 'light';
const darkThemeClass = 'dark';

// Set default theme based on a class applied to body
if (body.classList.contains(darkThemeClass)) {
  body.classList.remove(darkThemeClass);
  body.classList.add(lightThemeClass);
} else {
  body.classList.add(lightThemeClass);
}

themeToggle.addEventListener('click', () => {
  if (body.classList.contains(lightThemeClass)) {
    body.classList.replace(lightThemeClass, darkThemeClass);
    localStorage.setItem('theme', 'dark');
  } else {
    body.classList.replace(darkThemeClass, lightThemeClass);
    localStorage.setItem('theme', 'light');
  }
});

// Load theme from localStorage on window load
// and set it on body
window.addEventListener('load', () => {
  const theme = localStorage.getItem('theme');
  if(theme==='light') {
      body.classList.replace(darkThemeClass, lightThemeClass);
  } else if(theme==='dark') {
      body.classList.replace(lightThemeClass, darkThemeClass);
  }
}); 
