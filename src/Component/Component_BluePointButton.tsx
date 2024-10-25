import styled from 'styled-components';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_BluePointButton {
  isVisible: boolean;
  text: string;
  isActive: boolean;
  onClickEvent: (event: React.MouseEvent<HTMLDivElement>) => void;
  marginBottom: string;
}

export const ComponentBluePointButton = ({ isVisible, text, onClickEvent, isActive, marginBottom }: Interface_BluePointButton) => {
  return (
    <DivVisible $isVisible={isVisible}>
      <div className="bgcolor">
        <DivFloatingPosition $marginBottom={marginBottom}>
          <DivBody $isActive={isActive} onClick={(event) => (isActive ? onClickEvent(event) : null)}>
            <ImagePointIcon src={'/assets/Icon_BluePoint.png'} />
            {text}
          </DivBody>
        </DivFloatingPosition>
      </div>
    </DivVisible>
  );
};

const DivVisible = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
  align-items: flex-end;
  background-color: white;
  position: relative;

  .bgcolor {
    background-color: white;
    width: 100%;
  }
`;

const DivFloatingPosition = styled.div<CustomProperties>`
  position: -webkit-sticky;
  position: sticky;
  margin-bottom: ${(props) => props.$marginBottom};
`;

const DivBody = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  ${(props) => (props.$isActive ? 'background-image: ' + Readonly.Color.Gradient_Point : 'background-color: ' + Readonly.Color.WaitingButton_DCDFEA)};
  color: ${Readonly.Color.White_FFFFFF};
  width: 100%;
  height: 50px;
  outline: none;
  cursor: pointer;
  border-radius: 6px;
  font-size: 15px;

  margin-top: ${(props) => props.$marginTop};
  margin-bottom: ${(props) => props.$marginBottom};
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
`;

const ImagePointIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;
