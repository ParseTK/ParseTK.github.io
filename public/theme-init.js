// Blocking on purpose: sets the theme before first paint. Keep in sync with ThemeToggle.tsx.
try {
  if (localStorage.getItem("theme") !== "light") {
    document.documentElement.classList.add("dark");
  }
} catch {
  document.documentElement.classList.add("dark");
}
