import React from 'react';
import styled from "styled-components";
import CardInfo from './CardInfo';

const cardData = [
    { icon: "fas fa-water", content: "Milieu préféré : Mers tropicales et subtropicales, souvent près des côtes et des récifs coralliens." },
    { icon: "fas fa-weight-hanging", content: "Poids moyen : 4 à 6 kg, mais peut atteindre jusqu'à 12 kg." },
    { icon: "fas fa-ruler", content: "Taille moyenne : 30 à 50 cm de longueur." },
    { icon: "fas fa-paint-brush", content: "Motif : Corps jaune pâle à gris avec des bandes sombres, souvent un motif rayé distinct." },
    { icon: "fas fa-exclamation-triangle", content: "Toxicité : Le poisson-lapin est toxique pour l'humain, particulièrement dans les organes internes." },
    { icon: "fas fa-leaf", content: "Habitat : Privilégie les zones côtières, les récifs coralliens et les herbiers marins." },
    { icon: "fas fa-people-carry", content: "Impact écologique : Compétition avec les espèces locales, menace pour la biodiversité marine." },
    { icon: "fas fa-chart-line", content: "Propagation rapide : L'espèce s'est rapidement étendue le long des côtes méditerranéennes." },
  ];
const InfoSection: React.FC = () => {
    // Type the styles explicitly as React.CSSProperties
    const sectionStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        height: '100%',
        padding: '20px',
        marginTop: '50px',
        marginBottom: '90px',
        backgroundColor:'#02577e',
        color: 'white'
    };

    const headingStyle: React.CSSProperties = {
        fontSize: '3rem',
        marginBottom: '20px',
        color:''
    };

    const paragraphStyle: React.CSSProperties = {
        fontSize: '1.2rem',
        maxWidth: '800px',
        margin: '0 auto',
    };

    return (
        <section id="about" style={sectionStyle}>
            <h1 style={headingStyle}>Poisson-lapin</h1>
            <p style={paragraphStyle}>
                Les côtes tunisiennes font face à une menace grandissante : l’invasion du poisson-lapin (Lagocephalus sceleratus). Cette espèce toxique, originaire des mers tropicales, perturbe les écosystèmes marins, menace la biodiversité et impacte les pêcheurs en entrant en compétition avec des espèces locales précieuses comme la pieuvre et la seiche.
            </p>
            <GridWrapper>
      {cardData.map((card, index) => (
        <CardInfo key={index} icon={card.icon} content={card.content} />
      ))}
    </GridWrapper>
        </section>
    );
};
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
`;
export default InfoSection;
