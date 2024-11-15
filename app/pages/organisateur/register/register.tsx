import React, { useState } from 'react';
import CloseIcons from "@/app/icons/x";
import EmailIcons from "@/app/icons/email";
import LockIcons from "@/app/icons/lock";
import ImageIcon from "@/app/icons/image"; // Assurez-vous d'avoir une icône pour l'image
import UserIcon from '@/app/icons/user';
import "./register.css";

export default function Register({ onClose, onSwitch }) {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="contenueLogin">
            <div className="CloseWindows" onClick={onClose}>
                <CloseIcons className="ICoClose" />
            </div>
            <h2 className="TitreLogin">Creation Compte</h2>
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
            <div className="Users">
                <UserIcon />
                <input
                    placeholder="Nom d'utilisation"
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
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
            <div className="ImageUpload">
                <ImageIcon />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="InputImage"
                />
            </div>
            <div className="phraseCreation">
                <p className="introPhrase">Vous avez déjà un compte ?</p>
                <span className="liens" onClick={onSwitch}>Connectez-vous ici</span>
            </div>
            <div className="buttonValide">
                <button type="submit" className="BTNConnecter">Créer</button>
            </div>
        </div>
    );
}
