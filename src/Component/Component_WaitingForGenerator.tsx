import styled from 'styled-components';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { ComponentBlueColorLabel } from './Component_BlueColorLabel';

interface Interface_WaitingForGenerator {
  isVisible: boolean;

  topText?: string;
  height?: string;
  bottomText?: string;
}

export const ComponentWaitingSpinner = ({ topText, bottomText, height, isVisible }: Interface_WaitingForGenerator) => {
  return (
    <DivModalWaitingSpinner $height={height ?? '100%'} $isVisible={isVisible}>
      <ImageGIF src={'/assets/Spinner_WaitingForGenerator.gif'} />
      <ComponentBlueColorLabel marginTop={'20px'} text={topText ?? ''} fontSize={'16px'} />
      <ComponentBlueColorLabel marginTop={topText === undefined ? '20px' : '8px'} text={bottomText ?? '잠시만 기다려 주세요.'} fontSize={'16px'} />
    </DivModalWaitingSpinner>
  );
};

const DivModalWaitingSpinner = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  width: 100%;
  display: ${(props) => (props.$isVisible ? '' : 'none')};
  flex-direction: column;
  height: ${(props) => props.$height};
`;

const ImageGIF = styled.img`
  width: 45px;
  height: 40px;
`;
