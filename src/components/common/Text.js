
const Text = ({
  text,
  color = 'text-gray-800',
  fontSize = 'text-base',
  fontWeight = 'font-normal',
  className = '',
  as: Component = 'div', // default to <span>, can be overridden
  children, // optional if you want to nest text
}) => {
  const combinedClass = `${color} ${fontSize} ${fontWeight} ${className}`;

  return <Component className={combinedClass}>{children || text}</Component>;
};

export default Text;
