export interface AdminCategoria {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
}

export interface AdminLugar {
  id: number;
  categoriaId: number;
  nombre: string;
  lat: number;
  lon: number;
  publicado: boolean;
}
