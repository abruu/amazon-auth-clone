import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in — Amazon" },
      { name: "description", content: "Sign in to your account." },
    ],
  }),
});

type Mode = "signin" | "signup";

const credsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(255),
  password: z
    .string()
    .min(6, "Passwords must be at least 6 characters.")
    .max(72, "Password too long."),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already signed in, bounce home.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled && data.session) navigate({ to: "/" });
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("Signed in.");
        navigate({ to: "/" });
      } else {
        const { error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
        setMode("signin");
        setPassword("");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-amazon text-foreground flex flex-col">
      {/* Logo header */}
      <header className="flex justify-center pt-6 pb-4">
        <Link to="/" aria-label="Amazon home" className="select-none">
          <span className="text-3xl font-bold tracking-tight">
            amazon<span className="text-amazon-link-hover">.</span>
          </span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center px-4">
        {/* Auth card */}
        <section className="w-full max-w-[22rem] rounded-lg border border-amazon-border bg-amazon-card p-5 sm:p-6 shadow-sm">
          <h1 className="text-[1.75rem] leading-tight font-normal mb-3">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-[13px] font-bold mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[31px] px-2 rounded-[3px] border border-amazon-border bg-amazon-input text-sm shadow-[inset_0_1px_2px_rgba(15,17,17,0.1)] focus:outline-none focus:border-amazon-input-focus-ring focus:ring-2 focus:ring-amazon-input-focus-ring/60 transition"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[13px] font-bold mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[31px] px-2 rounded-[3px] border border-amazon-border bg-amazon-input text-sm shadow-[inset_0_1px_2px_rgba(15,17,17,0.1)] focus:outline-none focus:border-amazon-input-focus-ring focus:ring-2 focus:ring-amazon-input-focus-ring/60 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[31px] rounded-[8px] bg-amazon-yellow hover:bg-amazon-yellow-hover active:brightness-95 text-amazon-yellow-foreground text-[13px] font-normal border border-[oklch(0.7_0.13_85)] shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Continue" : "Create your account"}
            </button>
          </form>

          <p className="mt-4 text-[12px] leading-snug text-foreground/80">
            By continuing, you agree to Amazon's{" "}
            <a className="text-amazon-link hover:text-amazon-link-hover hover:underline" href="#">
              Conditions of Use
            </a>{" "}
            and{" "}
            <a className="text-amazon-link hover:text-amazon-link-hover hover:underline" href="#">
              Privacy Notice
            </a>
            .
          </p>

          {mode === "signin" && (
            <details className="mt-3 text-[13px]">
              <summary className="cursor-pointer flex items-center gap-1 text-foreground/90 hover:text-amazon-link-hover">
                <ChevronRight className="h-3 w-3" />
                Need help?
              </summary>
              <div className="pl-4 pt-1 text-[12px] text-foreground/70">
                Forgot password support is not enabled in this demo.
              </div>
            </details>
          )}
        </section>

        {/* Divider */}
        <div className="w-full max-w-[22rem] my-5 flex items-center gap-3 text-[12px] text-foreground/60">
          <div className="h-px flex-1 bg-amazon-border" />
          <span>{mode === "signin" ? "New to Amazon?" : "Already a customer?"}</span>
          <div className="h-px flex-1 bg-amazon-border" />
        </div>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setPassword("");
          }}
          className="w-full max-w-[22rem] h-[29px] rounded-[8px] bg-gradient-to-b from-[oklch(0.97_0.005_90)] to-[oklch(0.92_0.005_90)] hover:from-[oklch(0.95_0.005_90)] hover:to-[oklch(0.88_0.01_90)] border border-amazon-border text-[13px] text-foreground transition"
        >
          {mode === "signin" ? "Create your Amazon account" : "Sign in instead"}
        </button>
      </main>

      <footer className="mt-10 border-t border-amazon-border bg-gradient-to-b from-background to-[oklch(0.96_0.005_90)] py-6">
        <div className="max-w-2xl mx-auto text-center text-[12px] text-amazon-link space-x-4">
          <a href="#" className="hover:text-amazon-link-hover hover:underline">Conditions of Use</a>
          <a href="#" className="hover:text-amazon-link-hover hover:underline">Privacy Notice</a>
          <a href="#" className="hover:text-amazon-link-hover hover:underline">Help</a>
        </div>
        <p className="text-center text-[11px] text-foreground/60 mt-2">
          © 1996–{new Date().getFullYear()}, Amazon-style demo
        </p>
      </footer>
    </div>
  );
}
