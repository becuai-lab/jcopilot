import styled from 'styled-components';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { useEffect, useState } from 'react';

interface Interface_HalfContentLeftTwoButton {
  leftButtonText?: string;
  rightButtonText: string;
  onLeftClick?: () => void;
  onRightClick: () => void;
}

const WIDTH_MAX_100_PERCENT = '100%',
  WIDTH_HALF_50_PERCENT = '50%';

export const ComponentHalfContentLeftTwoButton = ({ leftButtonText, rightButtonText, onLeftClick, onRightClick }: Interface_HalfContentLeftTwoButton) => {
  const [isOneButton, setOneButton] = useState(false);

  useEffect(() => {
    setOneButton(!leftButtonText || leftButtonText?.length < 1);
  }, [leftButtonText, rightButtonText]);

  return (
    <DivInlineFlex>
      {isOneButton === false && (
        <DivLeftResultButton $width={isOneButton ? WIDTH_MAX_100_PERCENT : WIDTH_HALF_50_PERCENT} $isLeftButton onClick={onLeftClick}>
          <ImageIcon src={'/assets/Icon_Recreation_Blue.png'} />
          {leftButtonText}
        </DivLeftResultButton>
      )}

      <DivLeftResultButton $width={isOneButton ? WIDTH_MAX_100_PERCENT : WIDTH_HALF_50_PERCENT} onClick={onRightClick}>
        {rightButtonText}
      </DivLeftResultButton>
    </DivInlineFlex>
  );
};

const DivInlineFlex = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-top: 15px;
  margin-bottom: 20px;
`;

const DivLeftResultButton = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: 15px;
  color: ${(props) => (props.$isLeftButton ? Readonly.Color.Blue_1F68F6 : Readonly.Color.White_FFFFFF)};
  background-color: ${(props) => (props.$isLeftButton ? Readonly.Color.WaitingButton_DCDFEA : Readonly.Color.DarkGray_333333)};
  margin-right: ${(props) => (props.$isLeftButton ? '15px' : '')};
  border-radius: 6px;
  width: ${(props) => props.$width};
  height: 50px;
  cursor: pointer;
`;

const ImageIcon = styled.img`
  width: 20px;
  object-fit: contain;
  margin-right: 5px;
  cursor: pointer;
`;
