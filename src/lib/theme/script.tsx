// Inline script injected before hydration to prevent FOUC (Flash of Unstyled Content).
// Reads localStorage + prefers-color-scheme and sets [data-theme] on <html>.
const themeScript = `
(function(){try{
  var k='portfolio-theme';
  var s=localStorage.getItem(k);
  if(s==='dark'||s==='light'){document.documentElement.setAttribute('data-theme',s);return;}
  var m=window.matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.setAttribute('data-theme',m?'light':'dark');
}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
