import { ReactNode, MouseEvent, AnchorHTMLAttributes } from "react";

interface GuardedLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  to: string;
  onNavigate: (to: string) => void;
  children: ReactNode;
}

/**
 * GuardedLink - Navigation link that routes through navigation guard
 *
 * Renders an <a> element that calls onNavigate(to) on click with preventDefault.
 * Used to reduce boilerplate for guarded navigation links in navbar and footer.
 */
export default function GuardedLink({ to, onNavigate, children, ...props }: GuardedLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onNavigate(to);
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
