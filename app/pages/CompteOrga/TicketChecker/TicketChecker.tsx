import { useState, useEffect } from 'react';
import TopnavOrga from '@/app/component/topnavOrga/topnavOrga';
import './ticketChecker.css';

export default function TicketChecker() {
  const [qrCode, setQrCode] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [checkedTickets, setCheckedTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState('all'); // 'all', 'checked', 'unchecked'

  useEffect(() => {
    // Charger les tickets vérifiés depuis le localStorage ou l'API
    const storedCheckedTickets = localStorage.getItem('checkedTickets');
    if (storedCheckedTickets) {
      setCheckedTickets(JSON.parse(storedCheckedTickets));
    }
  }, []);

  // Vérifier si le QR code a déjà été scanné
  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket = checkedTickets.find((ticket) => ticket.qrCode === qrCode);

    if (ticket) {
      setIsChecked(true); // Le QR code a déjà été scanné
    } else {
      setIsChecked(false); // Le QR code n'a pas encore été scanné
    }
  };

  // Enregistrer un QR code comme vérifié
  const handleCheckTicket = () => {
    const newTicket = { qrCode, dateChecked: new Date() };

    setCheckedTickets([...checkedTickets, newTicket]);
    localStorage.setItem('checkedTickets', JSON.stringify([...checkedTickets, newTicket])); // Sauvegarder dans localStorage
  };

  // Filtrer les tickets vérifiés et non vérifiés
  const filteredTickets = checkedTickets.filter((ticket) => {
    if (filter === 'checked') {
      return true;
    } else if (filter === 'unchecked') {
      return false;
    }
    return true; // 'all'
  });

  return (
    <div className="contenue1">
      <TopnavOrga />
      <div className="p-6">
        <h1 className="text-2xl font-bold GENERATOR">Ticket Checker</h1>
        
        {/* Formulaire pour scanner le QR code */}
        <form onSubmit={handleScan} className="mt-4 space-y-4">
          <input
            type="text"
            placeholder="Enter QR Code"
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            className="border p-2 w-full"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Check QR Code
          </button>
        </form>

        {/* Afficher si le QR code a déjà été scanné */}
        {isChecked && <p className="text-red-500 mt-4">This QR code has already been checked.</p>}
        {!isChecked && qrCode && <p className="text-green-500 mt-4">This QR code is available for checking.</p>}

        {/* Bouton pour marquer comme vérifié */}
        {qrCode && !isChecked && (
          <button onClick={handleCheckTicket} className="bg-green-500 text-white p-2 rounded mt-4">
            Mark as Checked
          </button>
        )}

        {/* Filtrage des tickets */}
        <div className="mt-6">
          <label htmlFor="filter" className="mr-2">Filter Tickets:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2"
          >
            <option value="all">All</option>
            <option value="checked">Checked</option>
            <option value="unchecked">Unchecked</option>
          </select>
        </div>

        {/* Affichage du tableau des tickets vérifiés */}
        <div className="mt-6">
          <h2 className="text-xl font-bold">Checked Tickets</h2>
          <table className="table-auto w-full mt-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">QR Code</th>
                <th className="border px-4 py-2">Date Checked</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{ticket.qrCode}</td>
                  <td className="border px-4 py-2">{new Date(ticket.dateChecked).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
