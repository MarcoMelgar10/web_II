import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Arreglo necesario para que los iconos de Leaflet se vean al usar Vite.
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Mapa interactivo reutilizable.
// puntos: [{ latitud, longitud, ciudad, estadio }]
// centro: [lat, lng] opcional · zoom: número opcional
const Mapa = ({ puntos = [], centro = [39.5, -98.35], zoom = 3, altura = 400 }) => {
  return (
    <MapContainer center={centro} zoom={zoom} style={{ height: altura, width: '100%', borderRadius: 12 }}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {puntos
        .filter((p) => p.latitud != null && p.longitud != null)
        .map((p, i) => (
          <Marker key={i} position={[p.latitud, p.longitud]}>
            <Popup>
              <strong>{p.estadio || p.ciudad}</strong>
              <br />
              {p.ciudad}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default Mapa;
