import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground mb-4">
          This is a placeholder privacy policy page for ZarvioAI. Replace this content
          with your final legal copy.
        </p>
        <p className="text-muted-foreground mb-8">
          We only collect information required to operate the product, improve service
          quality, and comply with applicable laws.
        </p>
        <Link href="/auth/signup" className="text-primary hover:underline">
          Back to sign up
        </Link>
      </div>
    </main>
  );
}
