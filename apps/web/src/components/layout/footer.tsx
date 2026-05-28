export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8 mt-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-[11px] text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          Base Tycoon — built on{" "}
          <a
            href="https://base.org"
            target="_blank"
            rel="noreferrer"
            className="text-mac-blue hover:underline"
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
