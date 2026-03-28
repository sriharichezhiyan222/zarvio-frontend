import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground mb-4">
          This is a placeholder terms page for ZarvioAI. Replace this text with your
          approved legal terms.
        </p>
        <p className="text-muted-foreground mb-8">
          By using ZarvioAI, users agree to the service terms, acceptable use policy,
          and billing terms for active subscriptions.
        </p>
        <Link href="/auth/signup" className="text-primary hover:underline">
          Back to sign up
        </Link>
      </div>
    </main>
  );
}
