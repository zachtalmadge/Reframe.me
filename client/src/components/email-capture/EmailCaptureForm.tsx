import * as React from "react";
import { Check, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  subscribeEmail,
  validateEmail,
  type EmailSource,
} from "@/lib/emailSubscriptions";

export interface EmailCaptureFormProps {
  source: EmailSource;
  variant?: "default" | "footer";
  consentVersion?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  privacyLine?: string;
  className?: string;
}

type FormState = "idle" | "loading" | "success";

export function EmailCaptureForm({
  source,
  variant = "default",
  consentVersion = "v1",
  title,
  description,
  buttonText = "Subscribe",
  privacyLine,
  className,
}: EmailCaptureFormProps) {
  const [email, setEmail] = React.useState("");
  const [formState, setFormState] = React.useState<FormState>("idle");
  const { toast } = useToast();
  const inputId = React.useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const validation = validateEmail(email);
    if (!validation.valid) {
      toast({
        title: "Invalid email",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setFormState("loading");

    const result = await subscribeEmail({
      email,
      source,
      consentVersion,
    });

    if (result.ok) {
      setFormState("success");
    } else {
      setFormState("idle");
      toast({
        title: "Couldn't subscribe",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const isFooter = variant === "footer";

  // Success state
  if (formState === "success") {
    return (
      <div
        className={cn(
          "animate-in fade-in-0 slide-in-from-bottom-2 duration-300",
          isFooter ? "py-2" : "py-6",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <div
          className={cn(
            "flex items-center gap-3",
            isFooter ? "justify-start" : "justify-center"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-teal-500/10 dark:bg-teal-400/10",
              isFooter ? "h-8 w-8" : "h-10 w-10"
            )}
          >
            <Check
              className={cn(
                "text-teal-600 dark:text-teal-400",
                isFooter ? "h-4 w-4" : "h-5 w-5"
              )}
              strokeWidth={2.5}
            />
          </div>
          <div>
            <p
              className={cn(
                "font-medium text-slate-900 dark:text-slate-100",
                isFooter ? "text-sm" : "text-base"
              )}
            >
              You're in!
            </p>
            <p
              className={cn(
                "text-slate-600 dark:text-slate-400",
                isFooter ? "text-xs" : "text-sm"
              )}
            >
              Check your inbox to confirm.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default variant - card-like with gradient accent
  if (!isFooter) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          "border border-slate-200/80 dark:border-slate-700/50",
          "bg-gradient-to-b from-white to-slate-50/50",
          "dark:from-slate-800/80 dark:to-slate-900/50",
          "shadow-sm",
          className
        )}
      >
        {/* Gradient accent line */}
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background:
              "linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #5eead4 100%)",
          }}
          aria-hidden="true"
        />

        <div className="p-6 md:p-8">
          {/* Header */}
          {(title || description) && (
            <div className="mb-5 space-y-1.5">
              {title && (
                <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100 md:text-xl">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 md:text-base">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
              <div className="relative flex-1">
                <label htmlFor={inputId} className="sr-only">
                  Email address
                </label>
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                />
                <Input
                  id={inputId}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={formState === "loading"}
                  required
                  autoComplete="email"
                  className={cn(
                    "h-11 pl-10 text-base",
                    "border-slate-200 dark:border-slate-700",
                    "bg-white dark:bg-slate-800/50",
                    "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                    "focus-visible:border-teal-500 focus-visible:ring-teal-500/20",
                    "dark:focus-visible:border-teal-400 dark:focus-visible:ring-teal-400/20"
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={formState === "loading"}
                className={cn(
                  "h-11 min-w-[120px] text-base font-medium",
                  "bg-teal-600 hover:bg-teal-700",
                  "dark:bg-teal-600 dark:hover:bg-teal-500",
                  "shadow-sm shadow-teal-600/20",
                  "transition-all duration-200"
                )}
              >
                {formState === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="sr-only">Subscribing...</span>
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </div>

            {/* Privacy line */}
            {privacyLine && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {privacyLine}
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Footer variant - compact and minimal
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-0.5">
          {title && (
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <label htmlFor={inputId} className="sr-only">
              Email address
            </label>
            <Input
              id={inputId}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={formState === "loading"}
              required
              autoComplete="email"
              className={cn(
                "h-9 text-sm",
                "border-slate-200 dark:border-slate-700",
                "bg-white dark:bg-slate-800/50",
                "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                "focus-visible:border-teal-500 focus-visible:ring-teal-500/20",
                "dark:focus-visible:border-teal-400 dark:focus-visible:ring-teal-400/20"
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={formState === "loading"}
            size="sm"
            className={cn(
              "h-9 px-4 text-sm font-medium",
              "bg-teal-600 hover:bg-teal-700",
              "dark:bg-teal-600 dark:hover:bg-teal-500",
              "transition-all duration-200"
            )}
          >
            {formState === "loading" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              buttonText
            )}
          </Button>
        </div>

        {/* Privacy line */}
        {privacyLine && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {privacyLine}
          </p>
        )}
      </form>
    </div>
  );
}
