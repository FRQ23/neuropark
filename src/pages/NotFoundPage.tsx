import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="card-calm p-12 max-w-lg mx-auto text-center space-y-4 my-16">
      <div className="w-16 h-16 rounded-2xl bg-calm-50 text-calm-700 flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800">Página no encontrada (404)</h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        La ruta a la que intentas acceder no existe o fue trasladada a otra sección del sistema.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Volver al Tablero Principal
          </Button>
        </Link>
      </div>
    </div>
  );
};
