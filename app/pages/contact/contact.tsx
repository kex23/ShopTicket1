import Topnav from "@/app/component/topnav";
import React from "react";
import "./contact.css";
import ButtonNav from "../../component/bottonnav/bottonnav";

export default function ContactPage(){
    return(
        <div className="contenue">
            <Topnav/>
            <div className="first">
                <div className="second">
                    <div className="Text">
                        <h2 className="question">C'est quoi ShopTicket?</h2>
                        <p className="reponse">ShopTicket est une plateforme en ligne complète dédiée à la gestion et à la vente de billets pour divers événements. <br /> Conçue pour répondre aux besoins des organisateurs d'événements, ShopTicket offre une solution intégrée qui simplifie le processus de billetterie, <br /> tout en permettant une gestion efficace et une promotion optimale des événements.</p>
                    </div>
                    <div className="Illustation">
                        <img src="./scene (2).jpg" alt=""  className="ImageIllustration" />
                    </div>
                </div>
                <div className="second">
                    <div className="Illustation">
                        <img src="./concert (2).jpg" alt=""  className="ImageIllustration" />
                    </div>
                    <div className="Text">
                        <h2 className="question">Quelles sont ses fonctionnalités ?</h2>
                        <ul className="reponse">
                            <li className="lireponse">Vente de Billets : Permet aux organisateurs de créer, gérer et vendre des billets pour divers types d'événements, tels que concerts, conférences, festivals, et événements sportifs. Les billets peuvent être numériques ou imprimables, offrant ainsi une flexibilité aux acheteurs.</li>
                            <li className="lireponse">Promotion d'Événements : Intègre des outils puissants pour promouvoir les événements à travers des campagnes de marketing ciblées, des notifications, et des intégrations avec les réseaux sociaux, afin d'attirer un public plus large.</li>
                            <li className="lireponse">Support Client : Inclut un service client réactif pour aider les organisateurs et les acheteurs à résoudre tout problème éventuel, assurant ainsi une expérience utilisateur sans accroc.</li>

                        </ul>
                    </div>
                    
                </div>
                <div className="second">
                    <div className="Text">
                        <h2 className="question">En quoi se distingue-t-il des autres ?</h2>
                        <p className="reponse">ShopTicket se distingue par sa facilité d'utilisation, sa flexibilité, et ses fonctionnalités complètes, <br /> permettant aux organisateurs de se concentrer sur la création d'expériences exceptionnelles tout en laissant la complexité de la gestion de la billetterie et de la promotion entre de bonnes mains.</p>
                    </div>
                    <div className="Illustation">
                        <img src="./concert (3).jpg" alt=""  className="ImageIllustration" />
                    </div>
                </div>
            </div>

            <div className="bas">
                <ButtonNav/>
            </div>
       
            
        </div>
    )
}