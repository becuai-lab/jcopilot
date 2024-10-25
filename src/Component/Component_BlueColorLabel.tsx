import styled from 'styled-components';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_BlueColorLabel {
  text: string;
  fontSize: string;

  marginTop?: string;
}

export const ComponentBlueColorLabel = ({ text, fontSize, marginTop }: Interface_BlueColorLabel) => {
  return (
    <LabelBody $fontSize={fontSize} $marginTop={marginTop}>
      {text}
    </LabelBody>
  );
};

const LabelBody = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: ${(props) => props.$fontSize};
  color: ${Readonly.Color.Blue_1F68F6};
  margin-top: ${(props) => props.$marginTop};
`;
