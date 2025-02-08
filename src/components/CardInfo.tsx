import React from 'react';
import styled from 'styled-components';

type CardInfoProps = {
  icon: string;
  content: string;
};

const CardInfo: React.FC<CardInfoProps> = ({ icon, content }) => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="main-content">
          <div className="header">
            <i className={icon}></i>
          </div>
          <p className="heading">{content}</p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 320px;
    height: 250px;
    padding: 20px;
    color: white;
    background: linear-gradient(rgb(14, 52, 70), #02577e) padding-box,
                linear-gradient(145deg, transparent 35%,#d39200, #40c9ff) border-box;
    border: 2px solid transparent;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    cursor: pointer;
    transform-origin: right bottom;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .card .main-content {
    flex: 1;
  }

  .card .heading {
    font-size: 24px;
    margin: 24px 0 16px;
    font-weight: 600;
  }

  .card:hover {
    rotate: 8deg;
  }
    i{
    color: #d39200
    font-size:40px
    }
`;

export default CardInfo;
