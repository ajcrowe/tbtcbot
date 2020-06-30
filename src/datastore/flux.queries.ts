export function supplyQuery(
  func: string,
  field = '_measurement',
  fieldValue = 'supply',
  range = '-1d',
  bucket = 'tbtc',
): string {
  return `from(bucket: "${bucket}")
    |> range(start: ${range})
    |> filter(fn: (r) => r["${field}"] == "${fieldValue}")
    |> ${func}()`;
}
