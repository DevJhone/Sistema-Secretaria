import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar"; // Importando a Navbar
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";  // Importação obrigatória para o Leaflet funcionar corretamente
import "../styles/MapaAtendimentos.css";  // Seu estilo customizado

// Configurando o ícone do marcador para evitar o bug dos ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapaAtendimentos = () => {
  const [produtores, setProdutores] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/produtores")
      .then((response) => {
        setProdutores(response.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtores:", error);
      });
  }, []);

  return (
    <div className="mapa-container">
      <h2>📍 Mapa de Atendimentos</h2>
      <MapContainer
        center={[-15.886842, -40.563154]}  // Centro inicial do mapa (Brasil)
        zoom={11
        }
        style={{ height: "500px", width: "100%" }}
        scrollWheelZoom={true}  // Habilita zoom com o scroll
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {produtores.map((produtor) => {
          // Convertendo as coordenadas para número e verificando se existem
          const lat = parseFloat(produtor.latitude);
          const lon = parseFloat(produtor.longitude);

          if (isNaN(lat) || isNaN(lon)) {
            return null;  // Se as coordenadas forem inválidas, não renderiza o marcador
          }

          return (
            <Marker
              key={produtor.id}
              position={[lat, lon]}
            >
              <Popup>
                <strong>{produtor.nome}</strong><br />
                {produtor.endereco}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapaAtendimentos;
