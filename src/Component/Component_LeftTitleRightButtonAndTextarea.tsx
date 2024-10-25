import styled, { keyframes } from 'styled-components';
import { ReactEventHandler, useCallback, useEffect, useRef, useState } from 'react';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { CallbackTimeout } from 'Utility/SetTimeout';
import { ComponentWaitingSpinner } from './Component_WaitingForGenerator';
import { ComponentDropdownMenuButton } from './Component_DropdownMenuButton';
import { ComponentCommonPopup } from './Component_CommonPopup';
import { DangerousClipboard } from 'Utility/DangerousClipboard';
import { IsErrorInputValue } from 'Utility/InputValueChecker';
import { ComponentHalfContentLeftTwoButton } from './Component_HalfContentLeftTwoButton';

import { PostHook_MouseDragEvent } from 'Server/AxiosAPI';
import { ComponentInputTextArea } from './Component_InputTextArea';
import TextArea, { TextAreaRef } from 'rc-textarea';
import getCaretCoordinates from 'Utility/getCaretCoordinates';
import { useInfo } from 'App';

interface Interface_LeftTitleRightButtonAndTextarea {
  isVisible: boolean;
  leftTitle: string;
  textareaHeight: string;

  draggable?: boolean;
  rewrite?: boolean;
  stateSetter?: (value: React.SetStateAction<string>) => void;
  rightCopyButtonTitle?: string;
  hasSecondButton?: boolean;
  subtitleText?: string;
  borderMargin?: string;
  textareaValue?: string;
  marginTop?: string;
  needBottonInformation?: boolean;
  textArray?: string[];
  seqID?: number;
  notHalfWidthMinHeight?: string;
  widthPadding?: string;

  recreationButton?: () => void;
  stateSetterForSaveToLibrary?: (value: React.SetStateAction<string>) => void;
  onCloseCallback?: (pureStringText: string) => void;
  onCallback?: () => void;

  companyInfo: useInfo;
}

const TOOLTIP_LIFE_TIME_SECOND = 3,
  ARRAY_MOUSE_DRAG_EVENT_THREE_MENU = ['길이 늘이기', '인용구 추가', '문장 업그레이드'],
  ARRAY_MOUSE_DRAG_EVENT_API_URL = ['/expand', '/quotation', '/upgrade'],
  DRAG_MINIMUM_LENGTH_3 = 3,
  DRAG_ACTIVE_TEXT_TAG = '<b style=font-weight:500!important;background-color:#DCDFEA;color:#1F68F6!important; >',
  FONT_SIZE_17PX = '17px',
  FONT_SIZE_17 = 17;

export const ComponentLeftTitleRightButtonAndTextarea = ({
  isVisible,
  leftTitle,
  rightCopyButtonTitle,
  seqID,
  textareaValue,
  textareaHeight,
  hasSecondButton,
  subtitleText,
  textArray,
  borderMargin,
  marginTop,
  needBottonInformation,
  draggable,
  rewrite,
  notHalfWidthMinHeight,
  widthPadding,
  stateSetter,
  onCallback,
  onCloseCallback,
  recreationButton,
  stateSetterForSaveToLibrary,
  companyInfo,
}: Interface_LeftTitleRightButtonAndTextarea) => {
  const [originText, setOriginText] = useState<string>('');
  const [listText, setListText] = useState<string[]>([]);
  const [isVisibleTooltip, setVisibleTooltip] = useState<boolean>(false);
  const [copyMousePosition_X, setMousePosition_X] = useState<number>(0);
  const [copyMousePosition_Y, setMousePosition_Y] = useState<number>(0);
  const [buttonName] = useState<string>(rightCopyButtonTitle ?? leftTitle);
  const [onSpinnerMouseDrag, setSpinnerMouseDrag] = useState<boolean>(false);
  const [isHalfWidth, setHalfWidth] = useState<boolean>(false);
  const [isAddQuotation, setAddQuotation] = useState<boolean>(false);
  const [isMouseDragDetail, setMouseDragDetail] = useState<boolean>(false);
  const [isApplyQuotation, setApplyQuotation] = useState<boolean>(false);
  const [popupText, setPopupText] = useState<string>('');

  const textareaRef = useRef<TextAreaRef | null>(null);
  const leftDraftDivRef = useRef<HTMLDivElement>(null);
  const [childInputHeight, setChildInputHeight] = useState<number>(0);

  const [popupMousePosition, setPopupMousePosition] = useState({
    xPosition: 0,
    yPosition: 0,
  });
  const [mouseDownPosition, setMouseDownPosition] = useState({
    pageX: 0,
    pageY: 0,
  });
  const [textareaIndex, setTextAreaIndex] = useState({
    startIndex: 0,
    endIndex: 0,
  });
  const [draggedText, setDraggedText] = useState<string>('');
  const [leftDragColorText, setLeftDragColorText] = useState<string>('');
  const [inputQuoteSpeaker, setInputQuoteSpeaker] = useState<string>('');
  const [inputQuoteText, setInputQuoteText] = useState<string>('');
  const [isPopupVisible, setPopupVisible] = useState<boolean>(false);
  const [isAPIDetail, setAPIDetail] = useState<boolean>(false);
  const [rightTitleIndex, setRightTitleIndex] = useState<number>(-1);
  const [apiText, setAPIText] = useState<string>();
  const { returnAPIMouseDragText, returnAPIDangerouseDragTag, errorAPIMouseDragText, onPostHookAPI_MouseDrag, onPostHookAPI_MouseDragForQuotation } =
    PostHook_MouseDragEvent({ article_text: draggedText }, companyInfo, setPopupText, () => {
      setSpinnerMouseDrag(false);
    });

  const onDrag = (_event: unknown) => {
    const textarea = textareaRef.current?.resizableTextArea?.textArea;
    if (!textarea) {
      return;
    }
    const start = textarea?.selectionStart ?? 0,
      end = textarea?.selectionEnd ?? 0;

    if (isNotGoodLength(start, end)) {
      initializer();
      return;
    }

    setTextAreaIndex({ startIndex: start, endIndex: end });

    const coordinates = getCaretCoordinates(textarea, end);
    if (coordinates === undefined) {
      return;
    }

    if (
      mouseDownPosition.pageX !== Readonly.Value.MagicKey_alternative_undefined_number ||
      mouseDownPosition.pageY !== Readonly.Value.MagicKey_alternative_undefined_number
    ) {
      return;
    }

    const heightPartial = 44;

    const pos = {
      x: coordinates.left + textarea.offsetLeft + 15,
      y: Math.min(coordinates.top + textarea.offsetTop + 30, textarea.offsetTop + textarea.offsetHeight - heightPartial),
    };

    showPopupMenu(pos.x, pos.y);
  };

  const onMouseDownEventForDrag = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    initializer();
    setMouseDownPosition({ pageX: event.pageX, pageY: event.pageY });
  };

  const onMouseUpEventForDrag = (event: React.MouseEvent<HTMLTextAreaElement | HTMLElement>) => {
    if (isMouseDragDetail) return;

    const textarea = textareaRef.current?.resizableTextArea?.textArea;
    const start = textarea?.selectionStart ?? 0,
      end = textarea?.selectionEnd ?? 0;

    if (!textarea || isNotGoodLength(start, end)) {
      initializer();

      return;
    }

    const mouseDown = mouseDownPosition;
    const mouseUp = { pageX: event.pageX, pageY: event.pageY };
    if (Math.abs(mouseUp.pageX - mouseDown.pageX) < 2 && Math.abs(mouseUp.pageY - mouseDown.pageY) < 2) {
      initializer();
      return;
    }

    setTextAreaIndex({
      startIndex: textarea.selectionStart,
      endIndex: textarea.selectionEnd,
    });
    showPopupMenu(event.clientX, event.clientY);
  };

  const showPopupMenu = (x: number, y: number) => {
    setPopupVisible(true);
    setPopupMousePosition({ xPosition: x, yPosition: y });
  };

  const isNotGoodLength = (start: number, end: number) => {
    return start === end || end - start < DRAG_MINIMUM_LENGTH_3;
  };

  const onClick_Request = () => {
    setPopupVisible(false);
    onPostHookAPIDivider(rightTitleIndex);
  };

  const onClick_ApplyButton = () => {
    const resultText =
      originText.substring(0, textareaIndex.startIndex) + returnAPIMouseDragText + originText.substring(textareaIndex.endIndex, originText.length);
    initializer();

    if (onCloseCallback) onCloseCallback(resultText);
  };

  const initializer = () => {
    setAPIText('');
    setDraggedText('');
    setLeftDragColorText('');
    setInputQuoteSpeaker('');
    setAddQuotation(false);
    setMouseDragDetail(false);
    setPopupVisible(false);
    setAPIDetail(false);
    setTextAreaIndex({ startIndex: -1, endIndex: -1 });
    setMouseDownPosition({
      pageX: Readonly.Value.MagicKey_alternative_undefined_number,
      pageY: Readonly.Value.MagicKey_alternative_undefined_number,
    });

    if (onCallback) {
      onCallback();
    }
  };

  const onPostHoockAPI_CreationQuotation = () => {
    if (inputQuoteSpeaker.length < 1 || IsErrorInputValue(inputQuoteSpeaker)) {
      setPopupText('인용문 대상의 입력은 필수입니다.');

      return;
    } else if (inputQuoteText.length < Readonly.Value.InputLength_Minimum_30 || IsErrorInputValue(inputQuoteText)) {
      setPopupText('인용문을 30자 이상 입력해주세요.');

      return;
    }

    const _id = seqID ?? 0;
    if (_id === 0) {
      alert('[ERROR] onPostHoockAPI_CreationQuotation -> seq_id is zero');
      return;
    }

    setInputQuoteSpeaker('');
    setInputQuoteText('');
    setAddQuotation(false);
    setMouseDragDetail(false);
    setSpinnerMouseDrag(true);
    setApplyQuotation(true);

    onPostHookAPI_MouseDragForQuotation(_id, ARRAY_MOUSE_DRAG_EVENT_API_URL[1], inputQuoteSpeaker, inputQuoteText, draggedText);
  };

  const onPostHookAPIDivider = (index: number) => {
    if (index < 0) {
      return;
    }

    setMouseDragDetail(true);

    if (index === 1) setAddQuotation(true);
    else {
      setAddQuotation(false);
      setSpinnerMouseDrag(true);
      onPostHookAPI_MouseDrag(seqID ?? 0, ARRAY_MOUSE_DRAG_EVENT_API_URL[index], draggedText);
    }
  };

  useEffect(() => {
    initializer();
  }, [draggable, isVisible]);

  useEffect(() => {
    if (!onSpinnerMouseDrag) {
      setAPIText(returnAPIMouseDragText);
    }
  }, [returnAPIMouseDragText, onSpinnerMouseDrag]);

  useEffect(() => {
    setHalfWidth(isAPIDetail && leftDragColorText.length > 1);
  }, [leftDragColorText, isAPIDetail]);

  useEffect(() => {
    if (textareaIndex.startIndex < 0 || textareaIndex.endIndex < 0) return;

    const target = originText.substring(textareaIndex.startIndex, textareaIndex.endIndex);

    if (target.length < DRAG_MINIMUM_LENGTH_3) return;

    setDraggedText(target);
    setLeftDragColorText(
      originText.substring(0, textareaIndex.startIndex) +
        DRAG_ACTIVE_TEXT_TAG +
        target +
        '</b>' +
        originText.substring(textareaIndex.endIndex, originText.length),
    );
  }, [textareaIndex]);

  useEffect(() => {
    if (rightTitleIndex !== 1 || leftDragColorText.length < 1) return;

    const childHeight = leftDraftDivRef?.current?.clientHeight ?? 98;

    setChildInputHeight(childHeight - 258);
  }, [rightTitleIndex, leftDragColorText, isAddQuotation]);

  useEffect(() => {
    if (!textareaValue || textareaValue.length < 1) return;

    setOriginText(textareaValue);
  }, [textareaValue]);

  useEffect(() => {
    if (!subtitleText) return;

    setListText([...subtitleText.split('\n')]);
  }, [subtitleText]);

  useEffect(() => {
    if (!textArray || textArray.length < 1) return;

    const count = textArray.length;
    let stackValue = '';

    for (let i = 0; i < count; ++i) stackValue += ' #' + textArray[i] + ' ';

    setOriginText(stackValue);

    if (stateSetterForSaveToLibrary) stateSetterForSaveToLibrary(stackValue);
  }, [textArray]);

  const onMouseDownEvent_Copy = async (event: React.MouseEvent<HTMLImageElement>) => {
    const rectangle = event.currentTarget.getBoundingClientRect();
    setMousePosition_X((rectangle?.x ?? 0) + (rectangle?.width ?? 0) * 0.25);

    const resultY = (rectangle?.top ?? 0) + window.scrollY;
    setMousePosition_Y(resultY + 10);

    if (isVisibleTooltip) return;

    setVisibleTooltip(true);
    CallbackTimeout(TOOLTIP_LIFE_TIME_SECOND, () => {
      setVisibleTooltip(false);
    });

    DangerousClipboard(subtitleText ?? originText);
  };

  return (
    <DivInlineBlockDisplay $isVisible={isVisible} $width={'100%'}>
      <DivDisplaySetter $display={isHalfWidth && isAPIDetail ? 'flex' : 'block'} $content={'margin-top:' + (marginTop ?? '20px') + '; margin-bottom:15px;'}>
        <LabelMiddleTitle $width={isHalfWidth && isAPIDetail ? '50%' : ''}>
          {leftTitle}
          <DivDisplaySetter $display={'inline-flex'} $content={'align-items: flex-end; height:26px; align-items: center;'}>
            <DivButtonMode onClick={onMouseDownEvent_Copy}>
              <ImageIcon $marginRight={'5px'} src={'/assets/Icon_Contents_Copy.png'} />
              {buttonName + ' 복사하기'}
            </DivButtonMode>

            <DivDisplayPosition $isVisible={isVisibleTooltip} $positionTop={copyMousePosition_Y + 10} $positionLeft={copyMousePosition_X}>
              <ImageIcon $width={'80px'} $height={'34px'} src={'/assets/Image_Tooltip_Popup.png'} />
            </DivDisplayPosition>

            <DivInlineBlockDisplay $isVisible={hasSecondButton} $display={'inherit'}>
              <DivBorderLine $marginLeft={borderMargin ?? '10px'} $marginRight={borderMargin ?? '10px'} />

              <DivButtonMode onClick={recreationButton}>
                <ImageIcon $marginRight={'5px'} src={'/assets/Icon_Title_Recreation.png'} />
                재생성하기
              </DivButtonMode>
            </DivInlineBlockDisplay>
          </DivDisplaySetter>
        </LabelMiddleTitle>

        <DivWidthLikeMargin32 $isVisible={isHalfWidth} />

        <DivDisplaySetter $display={isHalfWidth && isAPIDetail ? 'flex' : 'none'} $content={'justify-content: space-between; width : 50%'}>
          <LabelMiddleTitle $width={isHalfWidth && isAPIDetail ? '100%' : ''}>
            {ARRAY_MOUSE_DRAG_EVENT_THREE_MENU[rightTitleIndex]}
            <DivDisplaySetter $display={'inline-flex'} $content={'justify-content: flex-end; align-items: center;'}>
              <ImageIcon $isButton $width={'20px'} $marginLeft={'14px'} src={'/assets/Icon_Close_Button.png'} onClick={initializer} />
            </DivDisplaySetter>
          </LabelMiddleTitle>
        </DivDisplaySetter>
      </DivDisplaySetter>

      {subtitleText && subtitleText.length > 0 ? (
        <DivSubTitleListItem $width={widthPadding?.length ? 'calc(100% - ' + widthPadding + ')' : 'auto'}>
          {listText.map((item, index) => (
            <li key={index}> {item} </li>
          ))}
        </DivSubTitleListItem>
      ) : (
        <>
          {draggable === true ? (
            <DivMouseArea $isVisible={draggable}>
              <DivAbsolutePosition
                style={{
                  left: popupMousePosition?.xPosition - 400,
                  top: popupMousePosition?.yPosition - 330,
                }}>
                {isPopupVisible && draggedText.length > 1 && (
                  <ComponentDropdownMenuButton
                    isVisible={isPopupVisible && draggedText.length > 1}
                    nameArray={ARRAY_MOUSE_DRAG_EVENT_THREE_MENU}
                    callbackClickFrom={(index) => {
                      if (draggedText.length < DRAG_MINIMUM_LENGTH_3) {
                        return;
                      }

                      if (index === Readonly.Value.MagicKey_alternative_undefined_number) {
                        initializer();
                        return;
                      }

                      setRightTitleIndex(index);
                      setPopupVisible(false);
                      setAPIDetail(true);
                      setAPIText('');
                      onPostHookAPIDivider(index);
                    }}
                  />
                )}
              </DivAbsolutePosition>

              {isAPIDetail && isHalfWidth && leftDragColorText.length > 1 ? (
                <>
                  <DivDisplaySetter $display={'flex'} $content={'width : 50%; flex-direction: column'}>
                    <DivLeftTextareaLike>
                      <div
                        onMouseUp={onMouseUpEventForDrag}
                        dangerouslySetInnerHTML={{
                          __html: leftDragColorText,
                        }}
                        style={{ minHeight: notHalfWidthMinHeight }}
                      />
                    </DivLeftTextareaLike>
                    <DivInlineBlockDisplay $isVisible={needBottonInformation}>
                      <LabelBottomNotification $marginTop={'15px'}>
                        해당 기사는 [기사 작성 원칙]과 [표현 가이드]가 적용되어 생성된 기사입니다.
                      </LabelBottomNotification>
                      <LabelBottomNotification> 내용 영역 선택 시 부분적인 수정이 가능합니다. </LabelBottomNotification>
                    </DivInlineBlockDisplay>
                  </DivDisplaySetter>

                  <DivWidthLikeMargin32 $isVisible />

                  {isAddQuotation ? (
                    <DivDisplaySetter $display={'inline-flex'} $content={'flex-direction: column; width : 50%'}>
                      <DivRightContentArea $content={'align-items: flex-start; flex-wrap: wrap; flex-direction : column'}>
                        <LabelText $marginBottom={'10px'}> 인용문 대상 </LabelText>

                        <InputTextField
                          placeholder={'발언자의 소속, 직함 등'}
                          onChange={(event) => setInputQuoteSpeaker(event.target.value)}
                          value={inputQuoteSpeaker}
                          style={{ fontSize: FONT_SIZE_17 }}
                          maxLength={Readonly.Value.InputLength_Minimum_30}
                        />

                        <LabelText $marginBottom={'10px'} $marginTop={'20px'}>
                          인용문 내용
                        </LabelText>
                        <DivDisplaySetter $display={'block'} $content={'width : 100%'}>
                          <ComponentInputTextArea
                            isFlex
                            placeholder={'큰따옴표(‘”)는 제외하고 기사에 포함한 발언 내용을 입력합니다.'}
                            stateSetter={setInputQuoteText}
                            inputMaxLength={Readonly.Value.InputLength_Middle_300}
                            inputMinHeight={childInputHeight + 'px'}
                            backgroundColor={Readonly.Color.White_FFFFFF}
                            isBorder
                            textLengthMarginBottom={'16px'}
                            padding={'16px'}
                            width={'100%'}
                            isPositionAbsolute
                            isAutoHeight
                          />
                        </DivDisplaySetter>
                      </DivRightContentArea>

                      <ComponentHalfContentLeftTwoButton rightButtonText={'인용구 생성하기'} onRightClick={onPostHoockAPI_CreationQuotation} />
                    </DivDisplaySetter>
                  ) : (
                    <>
                      <DivDisplaySetter
                        $display={isApplyQuotation ? 'inline-block' : 'flex'}
                        $content={'flex-direction: column; width : 50%; align-items : center'}>
                        <DivTextareaLikeContents $isVisible={onSpinnerMouseDrag} style={{ height: '300px' }}>
                          <ComponentWaitingSpinner
                            isVisible={onSpinnerMouseDrag}
                            topText={ARRAY_MOUSE_DRAG_EVENT_THREE_MENU[rightTitleIndex] + ' 적용 중 입니다.'}
                          />
                        </DivTextareaLikeContents>

                        <DivInlineBlockDisplay $isVisible={onSpinnerMouseDrag === false} $width={'100%'}>
                          <DivRightContentArea $height={'453px'} $content={'letter-spacing: 0.03em; white-space: pre-line; min-width : 300px'}>
                            {apiText}
                          </DivRightContentArea>
                        </DivInlineBlockDisplay>

                        {onSpinnerMouseDrag === false && (
                          <ComponentHalfContentLeftTwoButton
                            rightButtonText={'적용하기'}
                            onRightClick={onClick_ApplyButton}
                            leftButtonText={'재생성하기'}
                            onLeftClick={onClick_Request}
                          />
                        )}
                      </DivDisplaySetter>
                    </>
                  )}
                </>
              ) : (
                <DivDisplaySetter ref={leftDraftDivRef} $display={'flex'} $content={'width : 100%; flex-direction: column'}>
                  <TextareaContents
                    className="immune-dropdown-close"
                    ref={textareaRef}
                    autoSize
                    onMouseUp={onMouseUpEventForDrag}
                    onMouseDown={onMouseDownEventForDrag}
                    onSelectCapture={onDrag}
                    value={originText}
                    onChange={(event) => {
                      const value = event.target.value;
                      setOriginText(value);
                      stateSetter && stateSetter(value);
                    }}
                    readOnly={rewrite === false}
                    maxLength={Readonly.Value.InputLength_Maximum_4000}
                    $content={'min-height : ' + notHalfWidthMinHeight}
                  />

                  <DivInlineBlockDisplay $isVisible={needBottonInformation}>
                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '15px', justifyContent: 'space-between' }}>
                      <LabelBottomNotification>{'해당 기사는 [기사 작성 원칙]과 [표현 가이드]가 적용되어 생성된 기사입니다.'}</LabelBottomNotification>
                      <TextLengthLabel>{originText.length}</TextLengthLabel>
                    </div>

                    <LabelBottomNotification> 내용 영역 선택 시 부분적인 수정이 가능합니다. </LabelBottomNotification>
                  </DivInlineBlockDisplay>
                </DivDisplaySetter>
              )}
            </DivMouseArea>
          ) : (
            <>
              <TextareaContents
                $width={widthPadding?.length ? 'calc(100% - ' + widthPadding + ')' : 'auto'}
                $content={Readonly.Style.Display_Flex_Center}
                readOnly
                $height={isHalfWidth ? '453px' : textareaHeight}
                value={originText}
              />

              <DivInlineBlockDisplay $isVisible={needBottonInformation}>
                <LabelBottomNotification $marginTop={'15px'}>
                  해당 기사는 [기사 작성 원칙]과 [표현 가이드]가 적용되어 생성된 기사입니다.
                </LabelBottomNotification>
                <LabelBottomNotification> 내용 영역 선택 시 부분적인 수정이 가능합니다. </LabelBottomNotification>
              </DivInlineBlockDisplay>
            </>
          )}
        </>
      )}

      <ComponentCommonPopup notificationText={popupText} onClick_Primary={() => setPopupText('')} />
    </DivInlineBlockDisplay>
  );
};

interface Interface_SpinnerInTheBox {
  isVisible: boolean;
  title: string;
  spinnerTitle?: string;
  isHalfWidth?: boolean;
  marginTop?: string;

  spinnerPositionTop?: string;
  height?: string;
  textareaMarginTop?: string;
  widthPadding?: string;
  isTextareaWidthPadding?: boolean;
}
export const ComponentSpinnerInTheBox = ({
  isVisible,
  title,
  isHalfWidth,
  marginTop,
  spinnerPositionTop,
  height,
  spinnerTitle,
  textareaMarginTop,
  widthPadding,
  isTextareaWidthPadding,
}: Interface_SpinnerInTheBox) => {
  const [width] = useState<string>(isHalfWidth ? '50%' : '100%');

  return (
    <DivInlineBlockDisplay
      $width={widthPadding?.length ? 'calc(' + width + ' - ' + widthPadding + ')' : width}
      $isVisible={isVisible}
      $marginTop={marginTop ?? '30px'}
      $height={height}>
      {title && title.length > 1 && <LabelMiddleTitle $width={isHalfWidth ? '50%' : ''}> {title} </LabelMiddleTitle>}

      <TextareaContents
        $width={isTextareaWidthPadding ? 'calc(100% - 48px)' : '100%'}
        $marginTop={textareaMarginTop}
        readOnly
        $height={isHalfWidth ? '453px' : '100px'}
      />

      <DivPosition $positionTop={spinnerPositionTop}>
        <ComponentWaitingSpinner isVisible={isVisible} topText={spinnerTitle ?? title + ' 생성 중 입니다.'} />
      </DivPosition>
    </DivInlineBlockDisplay>
  );
};

const DivWidthLikeMargin32 = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'inline-block' : 'none')};
  width: 32px;
  min-width: 32px;
`;

const DivInlineBlockDisplay = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? (props.$display ?? 'inline-block') : 'none')};
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  margin-top: ${(props) => props.$marginTop};
  ${(props) => props.$content};
`;

const DivDisplaySetter = styled.div<CustomProperties>`
  display: ${(props) => props.$display};
  ${(props) => props.$content}
`;

const DivPosition = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  width: 100%;
  position: relative;
  top: ${(props) => props.$positionTop ?? '-130px'};
`;

const DivMouseArea = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'flex' : 'none')};
  width: 100%;

  ::selection {
    background-color: ${Readonly.Color.WaitingButton_DCDFEA};
    color: ${Readonly.Color.Blue_1F68F6} !important;
  }
`;

const LabelText = styled.label<CustomProperties>`
  display: block;
  ${Readonly.Style.Basic_White_Font};
  color: ${Readonly.Color.Black_Zero};
  font-size: 14px;
  letter-spacing: 0.0145em;
  margin-bottom: ${(props) => props.$marginBottom};
  margin-top: ${(props) => props.$marginTop};
`;

const InputTextField = styled.input<CustomProperties>`
  width: -webkit-fill-available;
  height: ${(props) => props.$height ?? '18px'};
  border: solid 1px ${Readonly.Color.NonActive_DFDFDF};
  padding: 15px 16px 15px 16px;
  margin-top: ${(props) => props.$marginTop};
  outline: none;
  font-size: ${FONT_SIZE_17PX};

  &.input::-webkit-input-placeholder {
    position: absolute;
    left: 0px;
    top: 0px;
  }
`;

const DivLeftTextareaLike = styled.div<CustomProperties>`
  ${Readonly.Style.Basic_White_Font};
  color: ${Readonly.Color.Black_Zero};
  display: inline-flex;
  font-weight: 400;
  font-size: ${FONT_SIZE_17PX};
  background-color: ${Readonly.Color.Box_FCFDFF};
  border: solid 1px ${Readonly.Color.Box_EOE5EF};
  padding: 24px;
  border-radius: 6px;
  line-height: 22px;
  resize: none;
  outline: none;
  white-space: pre-line;
  min-width: 300px;
  width: ${(props) => props.$width};
`;

const DivAbsolutePosition = styled.div`
  position: relative;
  width: fit-content;
`;

const LabelBottomNotification = styled.label<CustomProperties>`
  ${Readonly.Style.Gray_Notice_Font};
  display: list-item;
  margin-top: ${(props) => props.$marginTop};
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0.0194em;
  list-style-position: inside;
  margin-left: 10px;
`;

const DivBorderLine = styled.div<CustomProperties>`
  border-left: solid 1px ${Readonly.Color.Dashed_C8CFE8};
  height: 16px;
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
`;

const AnimationFadeout = keyframes`
	20% { opacity : 1; }
	90% { opacity : 0; }
`;
const DivDisplayPosition = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  position: absolute;
  top: ${(props) => props.$positionTop}px;
  left: ${(props) => props.$positionLeft}px;
  z-index: 99;
  animation: ${AnimationFadeout} ${TOOLTIP_LIFE_TIME_SECOND + 0.5}s;
`;

const DivButtonMode = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: 13px;
  letter-spacing: 0.0194em;
  color: ${Readonly.Color.Black_Zero};
  cursor: pointer;
`;

const LabelMiddleTitle = styled.label<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  width: ${(props) => props.$width};
  justify-content: space-between;
  ${Readonly.Style.Basic_White_Font};
  letter-spacing: -0.002em;
  margin-left: ${(props) => props.$marginLeft};
  color: ${Readonly.Color.Black_Zero};
`;

const DivRightContentArea = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  justify-content: flex-start;
  ${Readonly.Style.Basic_White_Font};
  flex-wrap: wrap;
  height: fit-content;
  border: solid 1px ${Readonly.Color.Blue_1F68F6};
  padding: 24px;
  border-radius: 6px;
  color: ${Readonly.Color.Blue_1F68F6};
  background-color: ${Readonly.Color.Box_FCFDFF};
  font-size: ${FONT_SIZE_17PX};
  ${(props) => props.$content};
`;

const ImageIcon = styled.img<CustomProperties>`
  width: ${(props) => props.$width ?? '20px'};

  object-fit: cover;
  margin-bottom: ${(props) => props.$marginBottom};
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
  cursor: pointer;
`;

const TextAreaBox = `
	background-color: ${Readonly.Color.Box_FCFDFF};
	border: solid 1px ${Readonly.Color.Box_EOE5EF};
	${Readonly.Style.Basic_White_Font}
	color: ${Readonly.Color.Black_Zero};
	min-width: 660px;
	padding: 24px;
	font-size: ${FONT_SIZE_17PX};
	font-weight: 400;
	resize: none;
	outline: none;
	border-radius: 6px;
	white-space: pre-line;
`;

const DivSubTitleListItem = styled.div<CustomProperties>`
  width: ${(props) => props.$width};
  ${TextAreaBox}

  li::marker {
    font-size: 12px;
    line-height: 22px;
  }
`;

const DivTextareaLikeContents = styled.div<CustomProperties>`
  background-color: ${Readonly.Color.Box_FCFDFF};
  border: solid 1px ${Readonly.Color.Box_EOE5EF};
  border-radius: 6px;
  padding: 0;
  height: 100%;
  width: 100%;
  display: ${(props) => (props.$isVisible ? 'inline-block' : 'none')};
`;

const TextareaContents = styled(TextArea)<CustomProperties>`
  width: ${(props) => props.$width};
  ${TextAreaBox}
  line-height: 22px;
  height: ${(props) => props.$height};
  margin-top: ${(props) => props.$marginTop};
  ${(props) => props.$content};
`;

const TextLengthLabel = styled.div`
  font-style: normal;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.0057em;
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  color: #777777;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: right;
`;
