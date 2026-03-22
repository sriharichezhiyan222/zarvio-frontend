"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Phone, Loader2, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    phone: "",
    otp: "",
    agreeToTerms: false,
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/dashboard");
  };

  const handlePhoneSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!otpSent) {
      // Send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
      setIsLoading(false);
    } else {
      // Verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsLoading(false);
      router.push("/dashboard");
    }
  };

  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true);
    // Simulate OAuth redirect
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/dashboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Create your account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Start your 14-day free trial with ZarvioAI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-center gap-3 h-11 border-border hover:bg-muted"
              onClick={() => handleOAuthSignUp("google")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              variant="outline"
              className="w-full justify-center gap-3 h-11 border-border hover:bg-muted"
              onClick={() => handleOAuthSignUp("apple")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Continue with Apple
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Auth Method Tabs */}
          <Tabs value={authMethod} onValueChange={(v) => setAuthMethod(v as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="email" className="data-[state=active]:bg-background">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="data-[state=active]:bg-background">
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="mt-4">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 bg-input border-border"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-foreground">Company</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="company"
                        type="text"
                        placeholder="Acme Inc"
                        className="pl-10 bg-input border-border"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      className="pl-10 bg-input border-border"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10 bg-input border-border"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with a number and symbol
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeToTerms: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || !formData.agreeToTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phone" className="mt-4">
              <form onSubmit={handlePhoneSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 bg-input border-border"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={otpSent}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone" className="text-foreground">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      className="pl-10 bg-input border-border"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      disabled={otpSent}
                    />
                  </div>
                </div>

                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <Label htmlFor="signup-otp" className="text-foreground">Verification Code</Label>
                    <Input
                      id="signup-otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      className="bg-input border-border text-center text-lg tracking-widest"
                      maxLength={6}
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {"We've sent a code to "}{formData.phone}
                    </p>
                  </motion.div>
                )}

                {!otpSent && (
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="phone-terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreeToTerms: checked as boolean })
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="phone-terms" className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || (!otpSent && !formData.agreeToTerms)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {otpSent ? "Verifying..." : "Sending code..."}
                    </>
                  ) : otpSent ? (
                    "Verify & Create account"
                  ) : (
                    "Send verification code"
                  )}
                </Button>

                {otpSent && (
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    Use a different phone number
                  </button>
                )}
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
