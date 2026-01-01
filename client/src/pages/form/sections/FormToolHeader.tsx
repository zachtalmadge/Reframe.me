import { FileText } from "lucide-react";

interface FormToolHeaderProps {
  title: string;
  description: string;
  Icon: typeof FileText;
}

export function FormToolHeader({ title, description, Icon }: FormToolHeaderProps) {
  return (
    <div className="text-center space-y-5 mb-10 animate-fadeInUp delay-100 opacity-0">
      <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mx-auto shadow-lg border-2 border-primary/20">
        <Icon className="w-8 h-8 text-primary" aria-hidden="true" />
      </div>

      <div className="space-y-3">
        <h1
          id="form-heading"
          className="text-3xl md:text-4xl font-bold leading-tight text-foreground font-fraunces"
        >
          {title}
        </h1>
        <p
          className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto font-manrope"
          data-testid="text-tool-description"
        >
          {description}
        </p>
      </div>
    </div>
  );
}
