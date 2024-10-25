import styled from 'styled-components';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_BlueColorButton {
  index: number;
  stateSetter: (value: React.SetStateAction<number>) => void;

  text: string;
  fontSize: string;
  isActive: boolean;

  isPrimary?: boolean;
  marginTop?: string;
  marginLeft?: string;
  marginRight?: string;
  marginBottom?: string;
}

export const ComponentBlueBorderButton = ({
  index,
  stateSetter,
  text,
  fontSize,
  isActive,
  isPrimary,
  marginTop,
  marginLeft,
  marginRight,
  marginBottom,
}: Interface_BlueColorButton) => {
  return (
    <DivBody
      $fontSize={fontSize}
      $isPrimary={isPrimary}
      onClick={() => stateSetter(index)}
      $isActive={isActive}
      $marginTop={marginTop}
      $marginLeft={marginLeft}
      $marginBottom={marginBottom}
      $marginRight={marginRight}>
      {text}
    </DivBody>
  );
};

const DivBody = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: ${(props) => props.$fontSize};
  color: ${(props) => (props.$isActive ? Readonly.Color.Blue_1F68F6 : Readonly.Color.Gray_777777)};
  border: solid 1px ${(props) => (props.$isActive ? Readonly.Color.Blue_1F68F6 : Readonly.Color.NonActive_DFDFDF)};
  width: 100%;
  height: 50px;
  margin-top: ${(props) => props.$marginTop};
  margin-bottom: ${(props) => props.$marginBottom};
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => (props.$isPrimary ? '22px' : props.$marginRight)};
  outline: none;
  cursor: pointer;
  border-radius: 6px;
`;
