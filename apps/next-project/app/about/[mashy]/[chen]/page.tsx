export default function Page({ params }: any) {
  return <div>Params: {JSON.stringify(params)}</div>; // {"mashy":"xxx","chen":"xxx"}
}
