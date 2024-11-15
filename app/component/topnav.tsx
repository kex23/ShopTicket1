import React, { useState } from "react";
import "./topnav.css";
import HomeIcons from "../icons/home"; // Ensure this path is correct
import SearchIcons from "../icons/search";
import { Link } from "react-router-dom";
import OrganisateurIcons from "../icons/organisateur";
import MenuIcons from "../icons/menu";
import CloseIcons from "../icons/x";
import InfoIcon from "../icons/info";

export default function Topnav() {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/events?query=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            console.log("Search results:", data);
            // Update state or handle the results as needed
        } catch (error) {
            console.error("Error searching for events:", error);
        }
    };
    

    return (
        <div className="cadrenav">
            <div className="liste">
                <div className="withOuverture1" style={{ width: isOpen ? '10%' : '100%' }}>
                    <div className="Ouverture2" onClick={toggleNav}>
                        {isOpen ? <CloseIcons className="close"/> : <MenuIcons className="Menue"/>}
                    </div>   
                </div>
                
                {isOpen && (
                    <ul className="ulListe">
                        <li className="liListe"><Link to="/" className="liListe"><HomeIcons /> Accueil</Link></li>
                        <li className="liListe"><Link to="/contact" className="liListe"><InfoIcon/> Apropos</Link></li>
                        <li className="liListe"><Link to="/organisateur" className="liListe"><OrganisateurIcons/> Organisateur</Link></li>
                    </ul>
                )}
            </div>

            <div className="logo">
                <img className="logoImage" src="/shopTicket.png" alt="Image représentant l'équipe ou le bureau" />
                <h2 className="titrelogo">ShopTicket</h2>
            </div>

            <div className="recherche">
                <div className="incherche">
                  <form className="incherche" onSubmit={handleSearchSubmit}>
                        <input
                            placeholder="recherchez un evenement"
                            className="inputrecherche"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <button type="submit" className="button"><SearchIcons/></button>
                    </form>  
                </div>
                
            </div>
        </div>
    );
}
