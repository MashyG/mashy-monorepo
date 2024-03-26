export default function Template({
  children,
  left,
  right,
}: Readonly<{
  children: React.ReactNode;
  left: React.ReactNode;
  right: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {left}
      {right}
    </>
  );
}
