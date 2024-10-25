import styled from 'styled-components';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_MenuButton {
  index: number;
  title: string;
  active: boolean;
  onClickEvent: (index: number) => void;
  stateSetter: (value: number) => void;
  width?: string;
  fontSize?: string;
  marginLeft?: string;
  isHideMode?: boolean;
}
export const ComponentMenuButton = ({
  index,
  title,
  active,
  stateSetter: setState,
  width,
  fontSize,
  marginLeft,
  isHideMode,
  onClickEvent,
}: Interface_MenuButton) => {
  return (
    <ButtonBody
      onClick={() => onClickEvent(index)}
      $isActive={active}
      $width={width ?? '291px'}
      $marginLeft={marginLeft ?? '32px'}
      $height={isHideMode ? '50px' : '64px'}>
      <ImageIcon src={'/assets/Icon_Title_Button.png'} $marginLeft={isHideMode ? '30px' : '32px'} />
      <DivTitle $fontSize={fontSize ?? ''} $isActive={active}>
        {title}
      </DivTitle>
    </ButtonBody>
  );
};

const ButtonBody = styled.button<CustomProperties>`
  margin-top: 6px;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  ${(props) => (props.$isActive ? 'background-image :' + Readonly.Color.Gradient_Point : 'background-color :' + Readonly.Color.DarkGray_333333)};
  border-radius: 60px 0 0 60px;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  outline: none;
  margin-left: ${(props) => props.$marginLeft};
`;

const ImageIcon = styled.img<CustomProperties>`
  width: 30px;
  height: 30px;
  margin-left: ${(props) => props.$marginLeft};
  margin-right: 6px;
`;

const DivTitle = styled.div<CustomProperties>`
  ${Readonly.Style.Basic_White_Font};
  text-align: left;
  font-size: ${(props) => props.$fontSize};
  font-weight: ${(props) => (props.$isActive ? '700' : '400')};
`;
