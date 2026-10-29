// Applies the saved theme before first paint so the page never flashes light.
// Dark is the default; light is used only when the visitor chose it.
// Keep in sync with src/Components/ThemeToggle.tsx.
try {
  if (localStorage.getItem("theme") !== "light") {
    document.documentElement.classList.add("dark");
  }
} catch {
  document.documentElement.classList.add("dark");
}
