import { useState } from 'react';
import ReactQRReader from 'react-qr-reader'; // Correct import
import TopnavOrga from '@/app/component/topnavOrga/topnavOrga';

// Define the Ticket type
type Ticket = {
  qrCode: string;
  dateChecked: Date;
};

export default function TicketChecker() {
  const [qrCode, setQrCode] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [checkedTickets, setCheckedTickets] = useState<Ticket[]>([]); // Define state with the Ticket type
  const [filter, setFilter] = useState('all'); // 'all', 'checked', 'unchecked'
  const [loading, setLoading] = useState(false); // Loading indicator for verification

  const handleScan = (data: any) => {
    if (data) {
      setQrCode(data);
      const ticket = checkedTickets.find((ticket) => ticket.qrCode === data); // Now `ticket.qrCode` works
      setIsChecked(ticket ? true : false);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleCheckTicket = async () => {
    setLoading(true);
    try {
      // Send the QR code to the backend to verify if the ticket is valid
      const response = await fetch('/api/checkTicket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode }),
      });

      if (!response.ok) {
        throw new Error('Failed to verify ticket');
      }

      const result = await response.json();
      if (result.isValid) {
        const newTicket = { qrCode, dateChecked: new Date() };
        setCheckedTickets([...checkedTickets, newTicket]);
        localStorage.setItem('checkedTickets', JSON.stringify([...checkedTickets, newTicket]));
        setIsChecked(true);
      } else {
        alert('Invalid ticket');
      }
    } catch (err) {
      console.error('Error verifying ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = checkedTickets.filter((ticket) => {
    if (filter === 'checked') return true;
    if (filter === 'unchecked') return false;
    return true; // 'all'
  });

  return (
    <div className="contenue1">
      <TopnavOrga />
      <div className="p-6">
        <h1 className="text-2xl font-bold GENERATOR">Ticket Checker</h1>

        {/* QR Code Scanner */}
        <ReactQRReader
          delay={300} // Optional: Adjust scanning delay (in ms)
          onScan={handleScan}
          onError={handleError}
        />

        {/* Scanned QR Code Display */}
        {isChecked && <p className="text-red-500 mt-4">This QR code has already been checked.</p>}
        {!isChecked && qrCode && <p className="text-green-500 mt-4">This QR code is available for checking.</p>}

        {/* Mark as Checked Button */}
        {qrCode && !isChecked && (
          <button
            onClick={handleCheckTicket}
            className="bg-green-500 text-white p-2 rounded mt-4"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Mark as Checked'}
          </button>
        )}

        {/* Ticket Filter */}
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

        {/* Display Checked Tickets */}
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
