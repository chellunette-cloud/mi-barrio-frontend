const integerFormatter = new Intl.NumberFormat('es-CO');
const decimalFormatter = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0
});

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

export function formatDecimal(value: number): string {
  return decimalFormatter.format(value);
}

export function formatArea(hectareas: number, metrosCuadrados: number): string {
  return `${formatDecimal(hectareas)} ha · ${formatDecimal(metrosCuadrados)} m²`;
}
