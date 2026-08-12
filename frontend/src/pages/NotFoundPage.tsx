import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-void px-6 text-center">
      <p className="font-mono text-sm tracking-widest text-lightning">ERROR 404</p>
      <h1 className="font-display text-3xl text-foreground">This realm does not exist</h1>
      <p className="max-w-sm text-mist">
        The page you're looking for was never forged, or the bridge to it has broken.
      </p>
      <Link
        to="/"
        className="mt-2 rounded-md bg-lightning px-5 py-2.5 font-medium text-void transition hover:bg-lightning-hot"
      >
        Return home
      </Link>
    </main>
  );
}
