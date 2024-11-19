import { useState, useEffect } from 'react';
import TopnavOrga from '@/app/component/topnavOrga/topnavOrga';
import './ticketGenerator.css';



export default function TicketGenerator() {
    const [formData, setFormData] = useState({ name: '', email: '', ticketType: '' });
    const [ticket, setTicket] = useState<any>(null);
    const [tickets, setTickets] = useState<any[]>([]); // Pour stocker tous les tickets créés
    const [error, setError] = useState<string | null>(null);
  
    // Fonction pour récupérer les tickets depuis l'API ou localStorage
    const loadTickets = async () => {
      try {
        const response = await fetch('/api/generateTicket'); // Supposons que vous ayez une route GET pour récupérer les tickets
        if (response.ok) {
          const data = await response.json();
          setTickets(data); // Charger les tickets depuis l'API
          localStorage.setItem('tickets', JSON.stringify(data)); // Sauvegarder dans le localStorage pour usage hors ligne
        } else {
          throw new Error('Failed to load tickets from API');
        }
      } catch (error) {
        console.error('Failed to load tickets from API:', error);
        const savedTickets = localStorage.getItem('tickets');
        if (savedTickets) {
          setTickets(JSON.parse(savedTickets)); // Charger les tickets du localStorage en cas d'échec de l'API
        }
      }
    };
  
    useEffect(() => {
      loadTickets(); // Charger les tickets lorsque le composant est monté
    }, []);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(formData); // Vérifier ce qui est envoyé dans le formulaire
    
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
        setTicket(data); // Stocke le ticket généré
        // Ajouter le ticket au tableau des tickets et mettre à jour localStorage
        const updatedTickets = [...tickets, data];
        setTickets(updatedTickets);
        localStorage.setItem('tickets', JSON.stringify(updatedTickets)); // Sauvegarder dans localStorage
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
            <option value="VIP">VIP</option>
            <option value="Standard">Standard</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Generate Ticket
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Afficher tous les tickets créés */}
        {tickets.length > 0 && (
            <div className="mt-6">
                <h2 className="text-xl font-bold TouteTickets">All Generated Tickets</h2>
                {tickets.map((ticket, index) => (
                <div key={index} className="tickeT">
                    <h2 className='TitresTicket'>Tickets Reko Tours</h2>
                    <div className="contenuTicket">
                        <div className="InfoTicket">
                            <p className='TextTicket'>ID: {ticket.id}</p>
                            <p className="TextTicket">Name: {ticket.name || 'Not Provided'}</p>
                            <p className="TextTicket">Email: {ticket.email || 'Not Provided'}</p>
                            <p className="TextTicket">Type: {ticket.ticketType || 'Not Provided'}</p>
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
