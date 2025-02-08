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
    { icon: "fas fa-chart-line", content: "Propagation rapide : L'espèce s'est rapidement étendue le long des côtes méditerranéennes." }
];

const SectionWrapper = styled.section`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: clamp(15px, 5vw, 40px);
    margin-top: clamp(30px, 5vw, 50px);
    margin-bottom: clamp(60px, 5vw, 90px);
    background-color: #02577e;
    color: white;

    @media (max-width: 768px) {
        padding: clamp(15px, 5vw, 30px);
        margin-top: clamp(20px, 5vw, 40px);
        margin-bottom: clamp(40px, 5vw, 80px);
    }
`;

const Heading = styled.h1`
    font-size: clamp(2rem, 5vw, 3rem);
    margin-bottom: clamp(15px, 3vw, 20px);
    color: white;
`;

const Paragraph = styled.p`
    font-size: clamp(1rem, 3vw, 1.2rem);
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.6;
`;

const GridWrapper = styled.div`
    display: grid;
    gap: clamp(105px, 3vw, 25px);
    width: 100%;
    max-width: 1200px;
    padding: clamp(15px, 3vw, 30px);

    /* Desktop layout */
    grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));

    /* Tablet layout */
    @media (max-width: 1024px) {
        grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
    }

    /* Mobile layout */
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const InfoSection: React.FC = () => {
    return (
        <SectionWrapper id="about">
            <Heading>Poisson-lapin</Heading>
            <Paragraph>
                Les côtes tunisiennes font face à une menace grandissante : l'invasion du poisson-lapin (Lagocephalus sceleratus). Cette espèce toxique, originaire des mers tropicales, perturbe les écosystèmes marins, menace la biodiversité et impacte les pêcheurs en entrant en compétition avec des espèces locales précieuses comme la pieuvre et la seiche.
            </Paragraph>
            <GridWrapper>
                {cardData.map((card, index) => (
                    <CardInfo 
                        key={index} 
                        icon={card.icon} 
                        content={card.content}
                    />
                ))}
            </GridWrapper>
        </SectionWrapper>
    );
};

export default InfoSection;