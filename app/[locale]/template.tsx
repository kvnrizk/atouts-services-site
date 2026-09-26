/**
 * Unlike a layout, a template is re-mounted on every navigation: its wrapper replays the
 * short "page-enter" fade (globals.css), which replaces the abrupt cut between pages.
 */
export default function LocaleTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
