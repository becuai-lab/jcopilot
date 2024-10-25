import styled from 'styled-components';
import { useEffect, useState } from 'react';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_DropdownMenuButton {
  isVisible: boolean;
  nameArray: string[];
  callbackClickFrom: (index: number) => void;

  translatePosition?: string;
}
interface Interface_ArrayItem {
  isActive: boolean;
  name: string;
}

const INITIALIZE_VALUE = -1;

export const ComponentDropdownMenuButton = ({ isVisible, nameArray, callbackClickFrom, translatePosition }: Interface_DropdownMenuButton) => {
  const [arrayMenuItem, setArrayMenuItem] = useState<Interface_ArrayItem[]>([]);
  const [popupHeight] = useState<number>(nameArray.length * 32 + 20);
  const [isShown, setIsShown] = useState(true);

  const onClickEvent_MenuItem = (index: number) => {
    setIsShown(false);
    callbackClickFrom(index);
  };

  const onMouseEvent_TextColorSetter = (index: number) => {
    let i;
    const count = nameArray.length;
    const array: Interface_ArrayItem[] = new Array(count);

    for (i = 0; i < count; ++i) array[i] = { isActive: i === index, name: nameArray[i] };

    setArrayMenuItem([...array]);
  };

  useEffect(() => {
    onMouseEvent_TextColorSetter(INITIALIZE_VALUE);
  }, [nameArray]);

  useEffect(() => {
    const popupChecker = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isOk = target.classList.contains('immune-dropdown-close') ?? false;
      if (!isOk) {
        callbackClickFrom(Readonly.Value.MagicKey_alternative_undefined_number);
      }
    };

    const keyboardChecker = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callbackClickFrom(Readonly.Value.MagicKey_alternative_undefined_number);
      }
    };

    if (true === isShown) {
      window.addEventListener('mousedown', popupChecker);
      window.addEventListener('keydown', keyboardChecker);
    }

    return () => {
      window.removeEventListener('mousedown', popupChecker);
      window.removeEventListener('keydown', keyboardChecker);
    };
  }, [isShown]);

  return (
    <DivGradiantBody $isVisible={isShown} $height={popupHeight + 'px'} $translatePosition={translatePosition} className="immune-dropdown-close">
      <DivWhiteBody $height={popupHeight - 26 + 'px'} className="immune-dropdown-close">
        {arrayMenuItem.map((item, key) => (
          <LabelMenuText
            className="immune-dropdown-close"
            onClick={() => onClickEvent_MenuItem(key)}
            onMouseEnter={() => onMouseEvent_TextColorSetter(key)}
            onMouseLeave={() => onMouseEvent_TextColorSetter(INITIALIZE_VALUE)}
            $isActive={item.isActive}
            key={key}>
            {item.name}
          </LabelMenuText>
        ))}
      </DivWhiteBody>
    </DivGradiantBody>
  );
};

const DivGradiantBody = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  position: absolute;
  transform: translate(${(props) => props.$translatePosition});
  display: ${(props) => (props.$isVisible ? '' : 'none')};
  width: 154px;
  height: ${(props) => props.$height};
  border-radius: 20px;
  background: #fff ${Readonly.Color.Gradient_Point};
  background-origin: border-box;
  background-clip: border-box;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
  z-index: 100;
`;

const LabelMenuText = styled.label<CustomProperties>`
  ${Readonly.Style.Basic_White_Font};
  color: ${(props) => (props.$isActive ? Readonly.Color.Blue_1F68F6 : Readonly.Color.DarkGray_333333)};
  font-size: 14px;
  line-height: 32px;
  width: 100%;
`;

const DivWhiteBody = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  align-items: flex-start;
  height: ${(props) => props.$height};
  flex-direction: column;
  flex-wrap: nowrap;
  width: 108px;
  border: solid 2px transparent;
  border-radius: 20px;
  background-color: ${Readonly.Color.White_FFFFFF};
  padding: 10px 20px 10px 20px;
`;
