export function Footer() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          Base Tycoon — built on{" "}
          <a
            href="https://base.org"
            target="_blank"
            rel="noreferrer"
            className="text-base-blue hover:underline"
          >
            Base
          </a>
          . Gas sponsored by Paymaster.
        </p>
        <p>© 2026 Base Tycoon</p>
      </div>
    </footer>
  );
}
