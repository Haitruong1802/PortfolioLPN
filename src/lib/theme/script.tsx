// Inline script injected before hydration to prevent FOUC (Flash of Unstyled Content).
// Reads localStorage + prefers-color-scheme and sets [data-theme] on <html>.
// Defaults to dark and never consults prefers-color-scheme - we only flip
// to light when the user has explicitly clicked the in-page toggle (which
// persists 'light' to localStorage).
const themeScript = `
(function(){try{
  var s=localStorage.getItem('portfolio-theme');
  document.documentElement.setAttribute('data-theme',s==='light'?'light':'dark');
}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
