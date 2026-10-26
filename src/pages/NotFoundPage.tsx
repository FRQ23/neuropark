import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w3-container w3-white w3-card w3-padding-48 w3-center w3-margin-top" style={{ maxWidth: '600px', margin: '48px auto' }}>
      <p>
        <i className="fa fa-compass w3-xxxlarge w3-text-dark-grey"></i>
      </p>
      <h1 className="w3-xxlarge w3-wide">PÁGINA NO ENCONTRADA (404)</h1>
      <p className="w3-text-grey" style={{ lineHeight: '1.8' }}>
        La ruta a la que intentas acceder no existe o fue trasladada a otra sección del sistema.
      </p>
      <div style={{ marginTop: '24px' }}>
        <Link to="/">
          <Button variant="primary" leftIcon={<i className="fa fa-home"></i>}>
            Volver al Tablero Principal
          </Button>
        </Link>
      </div>
    </div>
  );
};
