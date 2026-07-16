import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix for default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [nodes, setNodes] = useState([]);
  const tirukkovilurCenter = [11.9654, 79.2089]; // [lat, lng] for Leaflet

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/nodes`)
      .then(res => setNodes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer 
        center={tirukkovilurCenter} 
        zoom={14} 
        style={{ width: '100vw', height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {nodes.map(node => (
          <Marker key={node.id} position={[node.lat, node.lng]}>
            <Popup>{node.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        background: 'white', 
        padding: '12px', 
        borderRadius: '8px',
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <h3 style={{ margin: 0 }}>Tirukkovilur Nodes: {nodes.length}</h3>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>Free OpenStreetMap - No Token</p>
      </div>
    </div>
  );
}

export default App;