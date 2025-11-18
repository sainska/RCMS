import React, { useState } from "react";
import "./CreateProject.css";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { Bar, Pie } from "react-chartjs-2";
import PageHero from "@/components/layout/PageHero";
import SectionCard from "@/components/layout/SectionCard";
import { Button } from "@/components/ui/button";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale);

const LocationSelector = ({ setLocation, setMapCenter }) => {
  useMapEvents({
    click(e) {
      const newLocation = {
        latitude: e.latlng.lat.toFixed(6),
        longitude: e.latlng.lng.toFixed(6),
      };
      setLocation(newLocation);
    },
  });
  return null;
};

// Map control component for zoom and navigation
const MapControls = () => {
  const map = useMap();
  
  const handleZoomIn = () => {
    map.zoomIn();
  };
  
  const handleZoomOut = () => {
    map.zoomOut();
  };
  
  const handleResetView = () => {
    map.setView([-1.2921, 36.8219], 6);
  };
  
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to get your current location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };
  
  return (
    <div className="map-controls">
      <button onClick={handleZoomIn} className="map-control-btn" title="Zoom In">
        +
      </button>
      <button onClick={handleZoomOut} className="map-control-btn" title="Zoom Out">
        −
      </button>
      <button onClick={handleCurrentLocation} className="map-control-btn" title="Use Current Location">
        📍
      </button>
      <button onClick={handleResetView} className="map-control-btn" title="Reset View">
        🏠
      </button>
    </div>
  );
};

const CreateProject = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState([-1.2921, 36.8219]);
  const [mapZoom, setMapZoom] = useState(6);
  const navigate = useNavigate();

  // Enhanced budget data with more realistic values
  const [budgetData, setBudgetData] = useState({
    allocated: 1000000,
    used: 0,
    remaining: 1000000
  });

  // Enhanced project stages with progress
  const [stagesData, setStagesData] = useState({
    foundation: 0,
    framing: 0,
    roofing: 0,
    finishing: 0
  });

  // Search for location using Nominatim API
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCenter = [parseFloat(lat), parseFloat(lon)];
        setMapCenter(newCenter);
        setMapZoom(13);
        setLocation({
          latitude: lat,
          longitude: lon,
        });
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching for location. Please try again.");
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  // Enhanced Budget Chart Configuration
  const barData = {
    labels: ["Budget Allocated", "Budget Used", "Budget Remaining"],
    datasets: [
      {
        label: "Project Budget (Ksh)",
        backgroundColor: [
          "rgba(34, 139, 34, 0.8)",   // Construction Green
          "rgba(255, 99, 71, 0.8)",    // Tomato Red for Used
          "rgba(144, 238, 144, 0.8)"   // Light Green for Remaining
        ],
        borderColor: [
          "rgba(34, 139, 34, 1)",
          "rgba(255, 99, 71, 1)",
          "rgba(144, 238, 144, 1)"
        ],
        borderWidth: 2,
        borderRadius: 8,
        data: [budgetData.allocated, budgetData.used, budgetData.remaining],
      },
    ],
  };

  // Enhanced Project Stages Chart Configuration
  const pieData = {
    labels: ["Foundation", "Framing", "Roofing", "Finishing"],
    datasets: [
      {
        label: "Project Completion (%)",
        backgroundColor: [
          "rgba(34, 139, 34, 0.9)",   // Construction Green
          "rgba(46, 139, 87, 0.9)",   // Sea Green
          "rgba(107, 142, 35, 0.9)",  // Olive Green
          "rgba(144, 238, 144, 0.9)"  // Light Green
        ],
        borderColor: [
          "rgba(34, 139, 34, 1)",
          "rgba(46, 139, 87, 1)",
          "rgba(107, 142, 35, 1)",
          "rgba(144, 238, 144, 1)"
        ],
        borderWidth: 2,
        hoverOffset: 8,
        data: [
          stagesData.foundation || 25,
          stagesData.framing || 30,
          stagesData.roofing || 25,
          stagesData.finishing || 20
        ],
      },
    ],
  };

  // Chart options for better presentation
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 100, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return 'Ksh ' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          callback: function(value) {
            return 'Ksh ' + (value / 1000000).toFixed(1) + 'M';
          },
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '600'
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: '600'
          },
          generateLabels: function(chart) {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: `${label} (${data.datasets[0].data[i]}%)`,
              fillStyle: data.datasets[0].backgroundColor[i],
              strokeStyle: data.datasets[0].borderColor[i],
              lineWidth: 2,
              hidden: false,
              index: i
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 100, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !location.latitude || !location.longitude) {
      alert("Please fill in all fields and select a location.");
      return;
    }

    const newProject = {
      id: Date.now().toString(), // Generate unique ID
      title,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      createdAt: new Date().toISOString(),
      status: "pending",
      budget: {
        allocated: 1000000,
        used: 0,
        remaining: 1000000
      },
      stages: {
        foundation: 0,
        framing: 0,
        roofing: 0,
        finishing: 0
      }
    };

    try {
      // Try backend API first
      const result = await projectAPI.create(newProject);
      
      // Check if backend response is successful
      if (result && (result._id || result.id || result.success)) {
        alert('✅ Project created successfully!');
        // Store project in localStorage for demo purposes
        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        existingProjects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(existingProjects));
        
        setTitle('');
        setDescription('');
        setLocation({ latitude: '', longitude: '' });
        navigate('/user-dashboard');
        return;
      }
    } catch (error) {
      console.log('Backend not available, using local storage');
    }

    // Fallback to local storage if backend fails
    try {
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      existingProjects.push(newProject);
      localStorage.setItem('projects', JSON.stringify(existingProjects));
      
      alert('✅ Project created successfully! (Saved locally)');
      setTitle('');
      setDescription('');
      setLocation({ latitude: '', longitude: '' });
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error saving project locally:', error);
      alert('❌ Failed to create project. Please try again.');
    }
  };

  return (
    <div className="create-project-page">
      <PageHero
        eyebrow="Project creation"
        title="Create a new RCMS project"
        description="Set up a construction initiative with precise geolocation, budget insights, and phased tracking."
        badges={[
          { label: "Real-time mapping", variant: "success" },
          { label: "Budget analytics", variant: "neutral" },
        ]}
        actions={[
          {
            label: "Back to dashboard",
            variant: "outline",
            onClick: () => navigate(-1),
          },
          {
            label: "View schedules",
            variant: "secondary",
            onClick: () => navigate("/project-schedule"),
          },
        ]}
      />

      <div className="create-project-grid">
        <div className="create-project-main">
          <SectionCard title="Project Details" description="Provide the foundational information for this construction effort.">
            <form className="form-grid" onSubmit={handleSubmit}>
              <div className="form-field">
                <label>Project Title</label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div className="form-field">
                <label>Project Description</label>
                <textarea
                  placeholder="Describe scope, objectives, and high-level deliverables"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  className="input-field textarea"
                />
              </div>

              <div className="form-hint">
                Click the map to drop a pin. Use the search bar for exact addresses or coordinates.
              </div>

              <div className="latlon-grid">
                <div className="form-field">
                  <label>Latitude</label>
                  <input type="text" value={location.latitude} readOnly className="input-field muted" />
                </div>
                <div className="form-field">
                  <label>Longitude</label>
                  <input type="text" value={location.longitude} readOnly className="input-field muted" />
                </div>
              </div>

              <Button type="submit" className="action-button w-full">
                Create Project
              </Button>
            </form>
          </SectionCard>

          <SectionCard
            title="Project Location"
            description="Search for a site, refine using the map, and confirm coordinates instantly."
            toolbar={
              <div className="location-toolbar">
                <input
                  type="text"
                  placeholder="Search (e.g., Nairobi, Kenya)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="input-field"
                />
                <Button type="button" onClick={searchLocation}>
                  🔍 Search
                </Button>
              </div>
            }
            footer={
              <p className="map-instructions">
                💡 Tips: Click anywhere to select • Scroll to zoom • Drag to pan • Use toolbar for quick actions.
              </p>
            }
          >
            <div className="map-shell">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                scrollWheelZoom
                className="project-map"
                key={`${mapCenter[0]},${mapCenter[1]},${mapZoom}`}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                <LocationSelector setLocation={setLocation} setMapCenter={setMapCenter} />
                <MapControls />
                {location.latitude && location.longitude && (
                  <Marker position={[parseFloat(location.latitude), parseFloat(location.longitude)]}>
                    <Popup>
                      <div className="map-popup">
                        <strong>Selected Location</strong>
                        <p>Lat: {location.latitude}</p>
                        <p>Lng: {location.longitude}</p>
                      </div>
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </SectionCard>
        </div>

        <div className="create-project-insights">
          <SectionCard
            title="Budget Overview"
            description="Track allocation, usage, and headroom before breaking ground."
            toolbar={
              <div className="insight-badges">
                <span className="pill success">Real-time</span>
                <span className="pill neutral">KES</span>
              </div>
            }
          >
            <div className="chart-shell">
              <Bar data={barData} options={barOptions} />
            </div>
            <div className="budget-summary">
              <div>
                <p>Allocated</p>
                <strong>Ksh {(budgetData.allocated / 1000000).toFixed(1)}M</strong>
              </div>
              <div>
                <p>Used</p>
                <strong>Ksh {(budgetData.used / 1000000).toFixed(1)}M</strong>
              </div>
              <div>
                <p>Remaining</p>
                <strong>Ksh {(budgetData.remaining / 1000000).toFixed(1)}M</strong>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Project Stages" description="Visualize completion percentages for every milestone.">
            <div className="chart-shell">
              <Pie data={pieData} options={pieOptions} />
            </div>
            <div className="stage-progress">
              {[
                { name: "Foundation", value: stagesData.foundation || 25, color: "#228B22" },
                { name: "Framing", value: stagesData.framing || 30, color: "#2E8B57" },
                { name: "Roofing", value: stagesData.roofing || 25, color: "#6B8E23" },
                { name: "Finishing", value: stagesData.finishing || 20, color: "#90EE90" },
              ].map((stage) => (
                <div key={stage.name} className="stage-line">
                  <div className="stage-line__header">
                    <span>{stage.name}</span>
                    <span style={{ color: stage.color }}>{stage.value}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${stage.value}%`, backgroundColor: stage.color }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
