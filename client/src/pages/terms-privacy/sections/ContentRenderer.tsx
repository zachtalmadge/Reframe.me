import type { ContentBlock, GridColumn } from "../data/content.types";

interface ContentRendererProps {
  content: ContentBlock[];
}

export function ContentRenderer({ content }: ContentRendererProps) {
  return (
    <>
      {content.map((block, index) => (
        <ContentBlockRenderer key={index} block={block} />
      ))}
    </>
  );
}

function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <ParagraphBlock {...block} />;
    case "subsection":
      return <SubsectionBlock {...block} />;
    case "callout":
      return <CalloutBlock {...block} />;
    case "list":
      return <ListBlock {...block} />;
    case "grid":
      return <GridBlock {...block} />;
    default:
      return null;
  }
}

function ParagraphBlock({ text, className }: { text: string; className?: string }) {
  return <p className={className}>{text}</p>;
}

function SubsectionBlock({
  heading,
  bulletColor,
  content,
  hasDivider
}: {
  heading: string;
  bulletColor?: string;
  content: ContentBlock[];
  hasDivider?: boolean;
}) {
  return (
    <div className={`space-y-4 ${hasDivider ? "pt-6 border-t border-slate-200" : ""}`}>
      <h3 className="text-xl app-subheading text-slate-800 flex items-baseline gap-3">
        {bulletColor && (
          <span className={`w-1.5 h-1.5 rounded-full ${bulletColor} flex-shrink-0 mt-3`} />
        )}
        {heading}
      </h3>
      <ContentRenderer content={content} />
    </div>
  );
}

function CalloutBlock({
  variant,
  title,
  content,
  items,
  link
}: {
  variant: "info" | "warning" | "success";
  title?: string;
  content: string;
  items?: string[];
  link?: { text: string; url: string };
}) {
  const variants = {
    info: {
      container: "pl-6 bg-slate-50 border-l-4 border-teal-500 p-5 rounded-r-lg",
      title: "text-slate-800",
      text: "text-base"
    },
    warning: {
      container: "bg-amber-50 border-2 border-amber-200 p-6 rounded-xl",
      title: "text-amber-900",
      text: "text-amber-800"
    },
    success: {
      container: "bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-xl",
      title: "text-purple-900",
      text: "text-base",
      bullet: "text-purple-600"
    }
  };

  const style = variants[variant];

  return (
    <div className={style.container}>
      {title && <p className={`font-semibold ${style.title} mb-${items ? "3" : "2"}`}>{title}</p>}
      {content && <p className={style.text}>{content}</p>}
      {items && (
        <ul className="space-y-2 text-base">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className={`${style.bullet} font-bold mt-0.5`}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {link && (
        <p className="mt-4 text-sm text-purple-700">
          Learn more:{" "}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-purple-900 font-semibold"
          >
            {link.text}
          </a>
        </p>
      )}
    </div>
  );
}

function ListBlock({ variant, items }: { variant: "bullet" | "numbered" | "arrow"; items: string[] }) {
  if (variant === "numbered") {
    return (
      <ul className="space-y-4">
        {items.map((item, index) => {
          const [title, description] = item.split("|");
          return (
            <li key={index} className="flex items-start gap-4 bg-slate-50 p-5 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-teal-700 font-bold text-sm">{index + 1}</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">{title}</h4>
                <p>{description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  const bulletIcon = variant === "bullet" ? "•" : "→";
  const bulletColor = variant === "bullet" ? "text-teal-600" : "text-slate-400";

  return (
    <ul className="space-y-2 pl-6">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <span className={`${bulletColor} mt-1`}>{bulletIcon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function GridBlock({ columns }: { columns: GridColumn[] }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {columns.map((column, index) => (
        <GridColumnRenderer key={index} column={column} />
      ))}
    </div>
  );
}

function GridColumnRenderer({ column }: { column: GridColumn }) {
  const checkIcon = column.items[0].includes("Process") ? "✓" : "✗";
  const checkColor = column.items[0].includes("Process") ? "text-teal-600" : "text-orange-600";

  return (
    <div className={`bg-gradient-to-br ${column.bgGradient} p-6 rounded-xl border ${column.borderColor}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${column.iconColor}`} />
        <h4 className={`font-semibold ${column.headingColor} body-text`}>{column.heading}</h4>
      </div>
      <ul className="space-y-2 text-sm">
        {column.items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className={`${checkColor} mt-1`}>{checkIcon}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
