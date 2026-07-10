// Portal page – lightweight entry point
// Hides the loading screen immediately since the portal is just static HTML links.
document.addEventListener('DOMContentLoaded', () => {
  const ls = document.getElementById('loading-screen');
  if (ls) {
    ls.classList.add('fade-out');
    document.getElementById('app').classList.remove('hidden');
    setTimeout(() => ls.style.display = 'none', 800);
  }
});
