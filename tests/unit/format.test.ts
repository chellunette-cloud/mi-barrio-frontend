import { describe, expect, it } from 'vitest';
import { formatArea, formatDecimal, formatInteger } from '../../src/shared/lib/format.js';

describe('formato de datos', () => {
  it('usa separadores colombianos', () => {
    expect(formatInteger(3807)).toBe('3.807');
    expect(formatDecimal(9.1)).toBe('9,1');
    expect(formatArea(9.1, 94551.13)).toBe('9,1 ha · 94.551,13 m²');
  });
});
