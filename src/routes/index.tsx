import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out.");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background font-amazon text-foreground">
      <header className="bg-amazon-navy text-amazon-navy-foreground">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            amazon<span className="text-amazon-yellow">.</span>
          </Link>
          {loading ? null : session ? (
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden sm:inline opacity-90">
                Hello, {session.user.email}
              </span>
              <button
                onClick={signOut}
                className="rounded border border-white/30 hover:border-white px-3 py-1 transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded border border-white/30 hover:border-white px-3 py-1 text-sm transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-3">
          {session ? "You're signed in." : "Welcome."}
        </h1>
        <p className="text-foreground/70 mb-8">
          {session
            ? "Your password was hashed and stored by Lovable Cloud Auth — never in plaintext."
            : "Sign in to continue. Authentication runs on Lovable Cloud."}
        </p>
        {!session && (
          <Link
            to="/login"
            className="inline-flex items-center justify-center h-10 px-6 rounded-[8px] bg-amazon-yellow hover:bg-amazon-yellow-hover text-amazon-yellow-foreground text-sm font-medium border border-[oklch(0.7_0.13_85)] transition"
          >
            Continue to sign in
          </Link>
        )}
      </main>
    </div>
  );
}
