import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useRouter
import CloseIcons from "@/app/icons/x";
import EmailIcons from "@/app/icons/email";
import LockIcons from "@/app/icons/lock";
import "./login.css";

export default function Login({ onClose, onSwitch }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Use useNavigate instead of useRouter

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email === 'rabenjatovokex@gmail.com' && password === '123') {
            navigate('/compteOrga'); // Use navigate instead of router.push
        } else {
            alert('Invalid email or password');
        }
    };

    return (
        <div className="contenueLogin">
            <div className="CloseWindows">
                <CloseIcons className="ICoClose" onClick={onClose} />
            </div>
            <h2 className="TitreLogin">Connection</h2>
            <form onSubmit={handleSubmit}>
                <div className="Email">
                    <EmailIcons />
                    <input
                        placeholder="Adresse Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="InputMail"
                    />
                </div>
                <div className="Password">
                    <LockIcons />
                    <input
                        type="password"
                        placeholder="Mots de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="InputPassword"
                    />
                </div>
                <div className="phraseCreation">
                    <p className="introPhrase">Vous n'avez pas encore de compte?</p>
                    <span className="liens" onClick={onSwitch}>Créer ici</span>
                </div>
                <div className="buttonValide">
                    <button type="submit" className="BTNConnecter">Connecter</button>
                </div>
            </form>
        </div>
    );
}
