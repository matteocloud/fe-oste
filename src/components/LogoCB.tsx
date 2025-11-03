type LogoVariant = "solid" | "outline";

type LogoCBProps = {
  className?: string;
  title?: string;
  variant?: LogoVariant;
};

const LogoCB = (props: LogoCBProps) => {
  const { className = "", title = "Osteopata Chiara Benini" } = props;

  return (
    <img
      src="/logo.png"
      alt={title}
      className={className}
      loading="lazy"
    />
  );
};

export default LogoCB;
