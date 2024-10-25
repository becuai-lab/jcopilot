import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_InputTextArea {
  stateSetter: (value: React.SetStateAction<string>) => void;
  originSetter?: (value: React.SetStateAction<string>) => void;
  placeholder: string;
  height?: string;
  isFlex?: boolean;
  backgroundColor?: string;
  marginTop?: string;
  isBorder?: boolean;
  needLineWithLengthText?: boolean;
  isPositionAbsolute?: boolean;
  textLengthMarginBottom?: string;
  padding?: string;
  inputMaxLength?: number;
  width?: string;
  inputMinHeight?: string;
  inputReset?: boolean;
  isAutoHeight?: boolean;
  isMinHeightFitContent?: boolean;
}

export const ComponentInputTextArea = ({
  stateSetter,
  originSetter,
  placeholder,
  height,
  isFlex,
  backgroundColor,
  marginTop,
  isBorder,
  needLineWithLengthText,
  inputMinHeight,
  padding,
  inputMaxLength,
  textLengthMarginBottom,
  width,
  inputReset,
  isPositionAbsolute,
  isAutoHeight,
}: Interface_InputTextArea) => {
  const [length, setLength] = useState(0);
  const [inputValue, setInputValue] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onChange_InputSetter = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textValue = event?.target?.value;

    setLength(textValue?.length);
    stateSetter(textValue);
    setInputValue(textValue);

    originSetter && originSetter(textValue);

    if (isAutoHeight && textareaRef) {
      const element = textareaRef.current;
      const elementStyle = element?.style;

      if (elementStyle && textareaRef.current) {
        if (element.scrollHeight > element.clientHeight) elementStyle.height = textareaRef.current?.scrollHeight + 'px';
      }
    }
  };

  useEffect(() => {
    setInputValue('');
    setLength(0);
  }, [inputReset]);

  return (
    <DivDisplayFlex $display={isFlex ? 'flex' : 'grid'}>
      <TextInputArea
        $height={height}
        onChange={onChange_InputSetter}
        placeholder={placeholder}
        maxLength={inputMaxLength ?? 0}
        $color={backgroundColor}
        $marginTop={marginTop}
        $isBorder={isBorder}
        $padding={padding}
        $width={width}
        $minHeight={inputMinHeight}
        value={inputValue}
        ref={isAutoHeight ? textareaRef : null}
        rows={1}
      />

      <DivPositionSticky $content={isPositionAbsolute ? 'absolute' : ''}>
        <DivLine $isVisible={needLineWithLengthText} />

        <LabelTextLength $marginBottom={textLengthMarginBottom ?? '30px'}>
          {length}/{inputMaxLength ?? 0}
        </LabelTextLength>
      </DivPositionSticky>
    </DivDisplayFlex>
  );
};

const DivDisplayFlex = styled.div<CustomProperties>`
  display: ${(props) => props.$display};
  width: 100%;
  min-width: 442px;
  height: 100%;
  position: relative;
`;

const DivPositionSticky = styled.div<CustomProperties>`
  width: -webkit-fill-available;
  bottom: 0;
  position: ${(props) => props.$content};
  max-height: 56px;
  margin-left: 24px;
  margin-right: 24px;
`;

const TextInputArea = styled.textarea<CustomProperties>`
  padding: ${(props) => props.$padding ?? '20px'};
  background-color: ${(props) => props.$color ?? 'transparent'};
  height: ${(props) => props.$height};
  border: ${(props) => (props.$isBorder ? 'solid 1px ' + Readonly.Color.Border_DEDEDE : 'none')};
  outline: none;
  ${Readonly.Style.Basic_White_Font};
  font-size: ${(props) => props.$fontSize ?? '15px'};
  font-weight: 400;
  resize: none;
  font-size: 17px;
  color: ${Readonly.Color.Black_Zero};
  width: ${(props) => props.$width};
  min-height: ${(props) => props.$minHeight};
`;

const DivLine = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
  border-top: solid 1px ${Readonly.Color.Box_EOE5EF};
  width: 100%;
  margin: auto;
`;

const LabelTextLength = styled.label<CustomProperties>`
  ${Readonly.Style.Basic_White_Font};
  font-size: 14px;
  font-weight: 400;
  color: ${Readonly.Color.Gray_777777};
  ${Readonly.Style.Display_Flex_Center};
  justify-content: right;
  margin-top: 8px;
  margin-bottom: ${(props) => props.$marginBottom};
`;
