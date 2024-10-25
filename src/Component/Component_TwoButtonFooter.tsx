import styled from 'styled-components';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_BlueColorLabel {
  leftButtonName: string;
  rightButtonName: string;
  isVisible: boolean;
  onClickCallback_LeftButton: () => void;
  onClickCallback_RightButton: () => void;
  isHideMode?: boolean;
  calcWidth?: string;
}

export const ComponentTwoButtonFooter = ({
  isVisible,
  leftButtonName,
  rightButtonName,
  onClickCallback_LeftButton,
  onClickCallback_RightButton,
  isHideMode,
  calcWidth,
}: Interface_BlueColorLabel) => {
  return (
    <DivFooter $isVisible={isVisible} $isActive={isHideMode} $calcWidth={calcWidth}>
      <DivInlineFlex>
        <DivButtonBody onClick={onClickCallback_LeftButton}>
          <ImageIcon src={'/assets/Icon_NewButton.png'} />
          {leftButtonName}
        </DivButtonBody>

        <DivButtonBody $isPrimary onClick={onClickCallback_RightButton}>
          <ImageIcon src={'/assets/Icon_BluePoint.png'} />
          {rightButtonName}
        </DivButtonBody>
      </DivInlineFlex>
    </DivFooter>
  );
};

const DivInlineFlex = styled.div`
  display: inline-flex;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 70px;
  padding-left: 70px;
  padding-right: 70px;
`;

const DivFooter = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
  height: 150px;
  border-top: solid 1px ${Readonly.Color.Footer_E4E4E4};
  background-color: ${Readonly.Color.White_FFFFFF};
  border-radius: ${(props) => (props.$isActive ? '0' : '0 0 0 30px')};
  width: calc(100vw - ${(props) => props.$calcWidth});
  position: fixed;
  bottom: 0;
`;

const ImageIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: cover;
  margin-right: 8px;
`;

const DivButtonBody = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: 15px;
  color: ${(props) => (props.$isPrimary ? Readonly.Color.White_FFFFFF : Readonly.Color.Blue_1F68F6)};
  ${(props) => (props.$isPrimary ? 'background-image : ' + Readonly.Color.Gradient_Point : 'background-color : ' + Readonly.Color.White_FFFFFF)};
  border: ${(props) => (props.$isPrimary ? 'none' : 'solid 1px ' + Readonly.Color.Blue_1F68F6)};
  width: 100%;
  height: 50px;
  margin-left: ${(props) => (props.$isPrimary ? '10px' : '')};
  outline: none;
  cursor: pointer;
  border-radius: 6px;
`;
