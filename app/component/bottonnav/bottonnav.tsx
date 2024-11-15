import React from "react";
import "./bottonnav.css";
import EmailIcons from "../../icons/email";
import CallIcons from "../../icons/call";

export default function ButtonNav(){

    return(
        <div className="contenueBotton">
            <div className="logoBotton">
                <img src="./shopTicket.png" alt="" className="IMAGELogo"/>
            </div>

            <div className="createur">
                    <h3 className="nom">   ShopTicket a été créé par :</h3>
                    <h2 className="prenom">RABENJATOVO Kiady Nekena</h2>        
                    <h3 className="emailKex"><EmailIcons className="EmailIcons"/>rabenjatovokex@gmail.com</h3>
                    <h3 className="num"><CallIcons className="EmailIcons"/>0389029847</h3>             

            </div>
        </div>
    )
}