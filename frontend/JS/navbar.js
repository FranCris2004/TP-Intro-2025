// fetch('./navbar.html')
// .then(response => response.text())
// .then(data => {
//     document.getElementById('navbar-container').innerHTML = data;
// });

fetch('navbar.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;

    // 👇 Acá es cuando tenés que volver a llamar a mostrarUsuario()
    evalScripts(data); // Para que los scripts embebidos en navbar.html se ejecuten

    if (typeof mostrarUsuario === 'function') {
      mostrarUsuario();
    }
  });

function evalScripts(html) {
  const scripts = new DOMParser()
    .parseFromString(html, 'text/html')
    .querySelectorAll('script');

  scripts.forEach(script => {
    const newScript = document.createElement('script');
    if (script.src) {
      newScript.src = script.src;
    } else {
      newScript.textContent = script.textContent;
    }
    document.body.appendChild(newScript);
  });
}
