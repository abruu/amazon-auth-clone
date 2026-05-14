import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Amazon-style demo" },
      { name: "description", content: "Amazon-style login demo on Lovable Cloud." },
    ],
  }),
});

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login when page loads
    navigate({ to: "/login" });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background font-amazon text-foreground">
      <header className="bg-amazon-navy text-amazon-navy-foreground">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/amazon-logo.png"
              alt="Amazon.in"
              className="h-8 w-auto brightness-0 invert"
            />
          </Link>
          <Link
            to="/login"
            className="rounded border border-white/30 hover:border-white px-3 py-1 text-sm transition"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-3">
          Welcome.
        </h1>
        <p className="text-foreground/70 mb-8">
          Sign in to continue. Your credentials will be stored in Supabase.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center h-10 px-6 rounded-[8px] bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-yellow-foreground text-sm font-medium border border-[oklch(0.7_0.13_85)] transition"
        >
          Continue to sign in
        </Link>
      </main>
    </div>
  );
}
