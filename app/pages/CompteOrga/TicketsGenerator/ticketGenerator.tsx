import { useState, useEffect } from 'react';
import TopnavOrga from '@/app/component/topnavOrga/topnavOrga';
import './ticketGenerator.css';

export default function TicketGenerator() {
  const [formData, setFormData] = useState({ name: '', email: '', ticketType: '' });
  const [ticket, setTicket] = useState<any>({ ticketType: '' });
  const [tickets, setTickets] = useState<any[]>([]); // Stocke tous les tickets
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les tickets existants depuis le fichier CSV via l'API
  const loadTickets = async () => {
    try {
      const response = await fetch('/api/getTickets');
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          // Si le fichier CSV est vide, on supprime les tickets locaux
          localStorage.removeItem('tickets');
          setTickets([]);
        } else {
          setTickets(data);
          localStorage.setItem('tickets', JSON.stringify(data));
        }
      } else {
        throw new Error('Failed to load tickets from API');
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
  
      // Récupérer les données du localStorage uniquement si l'API échoue
      const savedTickets = localStorage.getItem('tickets');
      if (savedTickets) {
        setTickets(JSON.parse(savedTickets));
      }
    }
  };
  

  useEffect(() => { // Supprime les tickets locaux
    loadTickets(); // Charger les tickets depuis l'API
  }, []);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/generateTicket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setTicket(data); // Ajouter le ticket généré
      const updatedTickets = [...tickets, data];
      setTickets(updatedTickets);
      localStorage.setItem('tickets', JSON.stringify(updatedTickets)); // Mettre à jour le localStorage
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="contenue1">
      <TopnavOrga />
      <div className="p-6">
        <h1 className="text-2xl font-bold GENERATOR">Ticket Generator</h1>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border p-2 w-full"
          />
          <select
            value={formData.ticketType}
            onChange={(e) => setFormData({ ...formData, ticketType: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="" disabled>
              Select Ticket Type
            </option>
            <option value="Reservation">Reservation</option>
            <option value="PAF">PAF</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Generate Ticket
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Section d'affichage des tickets */}
        {tickets.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => {
                localStorage.removeItem('tickets');
                setTickets([]);
              }}
              className="bg-red-500 text-white p-2 rounded mt-4"
            >
              Clear All Tickets
            </button>

            <h2 className="text-xl font-bold TouteTickets">All Generated Tickets</h2>
            {tickets.map((ticket, index) => (
              <div key={index} className="tickeT">
                <h2 className="TitresTicket">Tickets Reko Tours</h2>
                <div className="contenuTicket">
                  <div className="InfoTicket">
                    <p className="TextTicket">ID: {ticket.ticketId}</p>
                    <p className="TextTicket">Cabaret a MAJUNGA BE @ Shams Hotel </p>
                    <p className="TextTicket">Le 29 Novembre 2024 a 20:00</p>

                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold">QR Code</h3>
                    <img src={ticket.qrCode} alt="QR Code" className="mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
