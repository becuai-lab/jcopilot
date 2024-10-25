import styled from 'styled-components';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_BlueColorLabel {
  notificationText: string;

  rightButtonName?: string;
  popupTitle?: string;

  onClick_Primary?: () => void;
  OnClick_AnyOption?: () => void;
}

export const ComponentCommonPopup = ({ notificationText, rightButtonName, popupTitle, onClick_Primary, OnClick_AnyOption }: Interface_BlueColorLabel) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupSize, setPopupSize] = useState({ minusWidth: 0, minusHeight: 0 });

  useEffect(() => {
    if (notificationText.length < 1 || !popupRef) return;

    const _width = -(popupRef.current?.offsetWidth ?? 0) * 0.5;
    const _height = -(popupRef.current?.offsetHeight ?? 0);
    setPopupSize({ minusWidth: _width, minusHeight: _height });
  }, [notificationText]);

  return (
    <DivModal $isVisible={notificationText.length > 1}>
      <DivPopupBody ref={popupRef} $content={'transform: translate(' + popupSize.minusWidth + 'px, ' + popupSize.minusHeight + 'px)'}>
        {popupTitle && popupTitle.length > 1 && <LabelText $isBold> {popupTitle} </LabelText>}

        <LabelText $marginBottom={'40px'}> {notificationText} </LabelText>

        {rightButtonName && rightButtonName.length > 1 ? (
          <DivInlineFlex>
            <DivButton onClick={onClick_Primary}> 취소 </DivButton>
            <DivButton $isPrimary $isActive onClick={OnClick_AnyOption}>
              {rightButtonName}
            </DivButton>
          </DivInlineFlex>
        ) : (
          <DivButton onClick={onClick_Primary}> 확인 </DivButton>
        )}
      </DivPopupBody>
    </DivModal>
  );
};

const DivModal = styled.div<CustomProperties>`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 998;
  background-color: ${Readonly.Color.Black_Zero}33;
  ${Readonly.Style.Display_Flex_Center};
  display: ${(props) => (props.$isVisible ? '' : 'none')};
`;

const DivPopupBody = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  flex-direction: column;
  min-width: 424px;
  width: fit-content;
  height: fit-content;
  padding: 20px 20px 16px 20px;
  background-color: ${Readonly.Color.White_FFFFFF};
  border-radius: 4px;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  ${(props) => props.$content};
`;

const LabelText = styled.label<CustomProperties>`
  ${Readonly.Style.Basic_White_Font};
  color: ${Readonly.Color.Black_Zero};
  line-height: 24px;
  font-weight: ${(props) => (props.$isBold ? '' : 400)};
  font-size: ${(props) => (props.$isBold ? '' : '16px')};
  letter-spacing: ${(props) => (props.$isBold ? '-0.002em' : '')};
  margin-bottom: ${(props) => props.$marginBottom};
  margin-top: 20px;
  white-space: break-spaces;
`;

const DivButton = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  width: ${(props) => (props.$isActive ? '210px' : '208px')};
  height: 50px;
  ${(props) => (props.$isPrimary ? 'border : none' : 'border: 1px solid ' + Readonly.Color.Blue_1F68F6)};
  ${(props) => (props.$isPrimary ? 'background-image :' + Readonly.Color.Gradient_Point : 'background-color: ' + Readonly.Color.White_FFFFFF)};
  cursor: pointer;
  margin-left: ${(props) => (props.$isPrimary ? '8px' : '')};
  border-radius: 6px;
  ${Readonly.Style.Basic_White_Font};
  color: ${(props) => (props.$isPrimary ? '' : Readonly.Color.Blue_1F68F6)};
  font-size: 15px;
`;

const DivInlineFlex = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  display: inline-flex;
`;
