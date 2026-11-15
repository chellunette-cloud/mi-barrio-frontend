import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BarrioFicha } from '../../src/features/barrio/components/BarrioFicha.js';
import { barrio } from '../fixtures.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('BarrioFicha', () => {
  it('muestra los datos oficiales y las fuentes de HU-01', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => barrio
    })));
    render(<BarrioFicha />);
    expect(await screen.findByText('3.807')).toBeInTheDocument();
    expect(screen.getByText('URBANIZACION CIUDAD GRANADA')).toBeInTheDocument();
    expect(screen.getByText(/9,1 ha/)).toBeInTheDocument();
    expect(screen.getByText('UPL14')).toBeInTheDocument();
    expect(screen.getAllByText(/SDP\/UAECD/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2026-11-15/).length).toBeGreaterThan(0);
  });

  it('muestra un estado de error con reintento', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: { code: 'ERROR', message: 'Fallo de prueba' } })
    })));
    render(<BarrioFicha />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Fallo de prueba');
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });
});
