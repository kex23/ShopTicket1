import React, { useState, useEffect } from "react";
import Topnav from "../../component/topnav";
import "./organisateur.css";
import Login from "./login/login";
import Register from "./register/register";
import ButtonNav from "../../component/bottonnav/bottonnav";

export default function Organisateur() {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        if (showLogin || showRegister) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        // Cleanup function to remove the class when the component unmounts
        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [showLogin, showRegister]);

    const handleConnectClick = () => {
        setShowLogin(true);
        setShowRegister(false);
    };

    const handleRegisterClick = () => {
        setShowRegister(true);
        setShowLogin(false);
    };

    const handleCloseClick = () => {
        setShowLogin(false);
        setShowRegister(false);
    };

    return (
        <div className="contenue">
            <Topnav />
            <div className="contenueOrga">
                <div className="acroche">
                    <div className="image">
                        <img src="/3190319.png" alt="" className="Image1" />
                    </div>
                    <div className="TextAccroch">
                        <h2 className="TitreAccroche">Essayer de vendre des tickets d'événements en ligne</h2>
                        <p className="phrasedAccroche">
                            ShopTicket est une solution entièrement en ligne pour la gestion complète de vos événements. <br /> 
                            De la billetterie numérique et sur place aux inscriptions, invitations, contrôle d'accès, gestion financière et marketing, <br /> 
                            ShopTicket vous offre une administration à 360° et une supervision en temps réel de votre événement. <br /> 
                            Simplifiez l'organisation et maximisez l'efficacité avec shopTicket.
                        </p>
                        <div className="btnConneter">
                            <button className="connecter" onClick={handleConnectClick}>Se connecter</button>
                        </div>
                    </div>
                </div>
                {(showLogin || showRegister) && (
                    <div className="afficheLogin">
                        {showLogin && <Login onClose={handleCloseClick} onSwitch={handleRegisterClick} />}
                        {showRegister && <Register onClose={handleCloseClick} onSwitch={handleConnectClick} />}
                    </div>
                )}
            </div>
            <div className="buttonNavContainer">
                <ButtonNav />
            </div>
        </div>
    );
}
