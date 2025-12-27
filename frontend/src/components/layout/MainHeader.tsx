import { Moon, Sun } from "lucide-react";


const MainHeader = ({ isDark, setIsDark }: { isDark: boolean; setIsDark: React.Dispatch<React.SetStateAction<boolean>> }) => {
  return (
  <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
      <span className="text-sm font-medium tracking-tight text-foreground/80">
        <a href="https://ferigutti.com" target="_blank" rel="noopener noreferrer">Leonardo Ferigutti</a>
      </span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setIsDark((prev) => !prev)}
          className="text-xs text-muted-foreground border border-border/60 rounded-full px-3 py-1 hover:bg-accent/40 hover:text-foreground transition-colors cursor-pointer"
        >
          {isDark ? <Moon />:  <Sun />}
        </button>
      </div>
    </div>
  </header>
  );

}

export default MainHeader;