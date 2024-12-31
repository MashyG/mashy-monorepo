export default function TitleShow(props: {
  title: string;
  titleStyle?: string;
  children?: React.ReactNode;
}) {
  const { title, titleStyle, children } = props || {};
  return (
    <div
      className={"text-2xl font-bold mt-6 mb-4 flex items-center " + titleStyle}
    >
      {children ? children : null}
      <span>{title ?? ""}</span>
    </div>
  );
}
