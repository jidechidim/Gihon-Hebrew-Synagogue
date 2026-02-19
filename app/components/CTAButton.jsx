import Link from "next/link";

function isExternalHref(href) {
  return /^(https?:|mailto:|tel:)/i.test(href);
}

export default function CTAButton({
  variant = "primary",
  href,
  type = "button",
  className = "",
  children,
  target,
  rel,
  ...props
}) {
  const variantClass = variant === "secondary" ? "btn-outline" : "btn-primary";
  const buttonClassName = ["btn", variantClass, className].filter(Boolean).join(" ");

  if (href) {
    if (isExternalHref(href)) {
      const safeRel = target === "_blank" ? rel || "noopener noreferrer" : rel;
      return (
        <a href={href} className={buttonClassName} target={target} rel={safeRel} {...props}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={buttonClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClassName} {...props}>
      {children}
    </button>
  );
}
