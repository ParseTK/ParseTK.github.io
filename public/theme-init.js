// Blocking on purpose: replays the style the app saved before first paint. It holds no option lists of its own.
try {
  var saved = JSON.parse(localStorage.getItem("style")).resolved;
  var root = document.documentElement;
  root.classList.add(saved.modeClass);
  for (var name in saved.vars) root.style.setProperty(name, saved.vars[name]);
} catch (error) {
  document.documentElement.classList.add("dark");
}
