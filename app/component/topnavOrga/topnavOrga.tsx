import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./topnavOrga.css";
import HomeIcons from "../../icons/home"; // Ensure this path is correct
import SearchIcons from "../../icons/search";
import { Link } from "react-router-dom";
import OrganisateurIcons from "../../icons/organisateur";
import MenuIcons from "../../icons/menu";
import CloseIcons from "../../icons/x";
import NotificationIcon from "../../icons/notification";
import LogOutIcon from "../../icons/logOut";
import ProfileIcon from "../../icons/profile"; // Add this import for profile icon

export default function TopnavOrga() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate(); // Use useNavigate from react-router-dom

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleLogout = () => {
        // Implement your logout logic here, e.g., clearing user session, tokens, etc.
        // After logout, redirect to the initial login page
        navigate("/"); // Use navigate for navigation
    };

    return (
        <div className="cadrenav">
            <div className="liste">
                <div className="withOuverture1" style={{ width: isOpen ? '10%' : '100%' }}>
                    <div className="Ouverture2" onClick={toggleNav}>
                        {isOpen ? <CloseIcons className="close" /> : <MenuIcons className="Menue" />}
                    </div>
                </div>

                {isOpen && (
                    <>
                        <ul className="ulListe">
                            <li className="liListe">
                                <Link to="/compteOrga">
                                    <div className="liListe">
                                        <HomeIcons /> Accueil compte
                                    </div>
                                </Link>
                            </li>
                            <li className="liListe">
                                <Link to="/notification">
                                    <div className="liListe">
                                        <NotificationIcon /> Notification
                                    </div>
                                </Link>
                            </li>
                            <li className="liListe">
                                <Link to="/organisateur">
                                    <div className="liListe">
                                        <OrganisateurIcons /> Organisateur
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </>
                )}
            </div>

            <div className="logo">
                <img className="logoImage" src="/shopTicket.png" alt="Image représentant l'équipe ou le bureau" />
                <h2 className="titrelogo">ShopTicket</h2>
            </div>

            {/* <div className="recherche">
                <input
                    placeholder="recherchez un evenement"
                    className="inputrecherche"
                />
                <button type="submit" className="button">
                    <SearchIcons />
                </button>
            </div> */}

            <div className="profileSection">
                <img className="profileImage" src="./user.jpg" alt="Profile" />
                <div className="profileMenuIcon" onClick={toggleProfileMenu}>
                    <ProfileIcon />
                </div>
                {isProfileMenuOpen && (
                    <div className="profileMenu">
                        <p className="TextDeco" onClick={handleLogout}>
                            <LogOutIcon /> Deconnexion
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
