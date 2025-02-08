import React, { useState } from 'react';
import styled from 'styled-components';

const DetectionSection = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleDetect = () => {
        if (selectedFile) {
            // Simulate a model prediction (replace this with actual model logic)
            setPrediction("Predicted result: Example Output");
        }
    };

    return (
        <div id="detection" style={{ height:'100vh' }} >
        <Header>
                <Title>Rabbit Fish Detection</Title>
                <Description>Upload an image to check if a rabbit fish is present.</Description>
        </Header>
        <Container>
            <StyledWrapper>
                <div className="container">
                    <div className="folder">
                        <div className="front-side">
                            <div className="tip" />
                            <div className="cover" />
                        </div>
                        <div className="back-side cover" />
                    </div>
                    <label className="custom-file-upload">
                        <input className="title" type="file" onChange={handleFileChange} />
                        Choose a file
                    </label>
                </div>
            </StyledWrapper>
            <RightPanel>
                {prediction && <PredictionText>{prediction}</PredictionText>}
                <DetectButton onClick={handleDetect}>Detect</DetectButton>
            </RightPanel>
        </Container>
        </div>
    );
};

const StyledWrapper = styled.div`
  .container {
    --transition: 350ms;
    --folder-W: 120px;
    --folder-H: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    background: linear-gradient(135deg, #6dd5ed, #2193b0);
    border-radius: 15px;
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    height: calc(var(--folder-H) * 1.7);
    position: relative;
  }

  .folder {
    position: absolute;
    top: -20px;
    left: calc(50% - 60px);
    animation: float 2.5s infinite ease-in-out;
    transition: transform var(--transition) ease;
  }

  .folder:hover {
    transform: scale(1.05);
  }

  .folder .front-side,
  .folder .back-side {
    position: absolute;
    transition: transform var(--transition);
    transform-origin: bottom center;
  }

  .folder .back-side::before,
  .folder .back-side::after {
    content: "";
    display: block;
    background-color: white;
    opacity: 0.5;
    z-index: 0;
    width: var(--folder-W);
    height: var(--folder-H);
    position: absolute;
    transform-origin: bottom center;
    border-radius: 15px;
    transition: transform 350ms;
    z-index: 0;
  }

  .container:hover .back-side::before {
    transform: rotateX(-5deg) skewX(5deg);
  }
  .container:hover .back-side::after {
    transform: rotateX(-15deg) skewX(12deg);
  }

  .folder .front-side {
    z-index: 1;
  }

  .container:hover .front-side {
    transform: rotateX(-40deg) skewX(15deg);
  }

  .folder .tip {
    background: linear-gradient(135deg, #ff9a56, #ff6f56);
    width: 80px;
    height: 20px;
    border-radius: 12px 12px 0 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: -10px;
    z-index: 2;
  }

  .folder .cover {
    background: linear-gradient(135deg, #ffe563, #ffc663);
    width: var(--folder-W);
    height: var(--folder-H);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  .custom-file-upload {
    font-size: 1.1em;
    color: #ffffff;
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: background var(--transition) ease;
    display: inline-block;
    width: 100%;
    padding: 10px 35px;
    position: relative;
  }

  .custom-file-upload:hover {
    background: rgba(255, 255, 255, 0.4);
  }

  .custom-file-upload input[type="file"] {
    display: none;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(-20px);
    }

    100% {
      transform: translateY(0px);
    }
  }`;

const Container = styled.div`
display: flex;
justify-content:center;
align-items: center;
gap: 80px;
margin-top:90px;
align-self: center;

`;

const RightPanel = styled.div`
display: flex;
flex-direction: column;
align-items: center;

`;

const DetectButton = styled.button`
background-color: #ff6f56;
color: white;
border: none;
padding: 10px 20px;
border-radius: 5px;
cursor: pointer;
transition: background 0.3s;

&:hover {
    background-color: #ff5733;
}
`;

const PredictionText = styled.p`
font-size: 1.2em;
font-weight: bold;
color: #333;
min-height:20px
`;
const Header = styled.div`
    text-align: center;
    margin-bottom: 60px;
`;

const Title = styled.h1`
    font-size: 3rem;
    font-weight: bold;
    color: #d39200;
`;

const Description = styled.p`
    font-size: 1.2em;
    color: white;
    margin-top: 5px;
`;
export default DetectionSection;
