import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { CallbackTimeout } from 'Utility/SetTimeout';
import { ComponentWaitingSpinner } from './Component_WaitingForGenerator';
import { DangerousClipboard } from 'Utility/DangerousClipboard';
import { ComponentHalfContentLeftTwoButton } from './Component_HalfContentLeftTwoButton';

interface Interface_DraftArticleRule {
  isVisible: boolean;
  rightTitle: string;
  originDraftText: string;
  onSpinner: boolean;
  receiveAPIDangerousTagText: string | undefined;
  onCloseCallback: () => void;
  onApplyCallback: () => void;

  onPostHookAPI: (value?: string) => void;
}

const TOOLTIP_LIFE_TIME_SECOND = 3,
  DRAFT_RULE_ACTIVE_ITEM_TAG = '<b style=color:#1F82F6 >';

export const ComponentDraftArticleRule = ({
  isVisible,
  rightTitle,
  originDraftText,
  onSpinner,
  receiveAPIDangerousTagText,
  onPostHookAPI,
  onApplyCallback,
  onCloseCallback,
}: Interface_DraftArticleRule) => {
  const [leftPureStringText, setLeftPureStringText] = useState<string>(originDraftText);

  const [dangerousRightText, setDangerousRightText] = useState<string>('');

  const [isVisibleTooltip, setVisibleTooltip] = useState<boolean>(false);
  const [mousePosition_X, setMousePosition_X] = useState<number>(0);
  const [mousePosition_Y, setMousePosition_Y] = useState<number>(0);

  const onMouseDownEvent_Copy = async (event: React.MouseEvent<HTMLImageElement>) => {
    const rectangle = event.currentTarget.getClientRects()?.item(0);
    setMousePosition_X((rectangle?.x ?? 0) + (rectangle?.width ?? 0) * 0.25);
    setMousePosition_Y((rectangle?.y ?? 0) + 10);

    if (isVisibleTooltip) return;

    setVisibleTooltip(true);
    CallbackTimeout(TOOLTIP_LIFE_TIME_SECOND, () => {
      setVisibleTooltip(false);
    });

    DangerousClipboard(leftPureStringText);
  };

  useEffect(() => {
    setLeftPureStringText(originDraftText);
  }, [originDraftText]);

  useEffect(() => {
    if (!receiveAPIDangerousTagText || receiveAPIDangerousTagText.length < 1) return;

    const resultText = receiveAPIDangerousTagText.replaceAll('<b>', DRAFT_RULE_ACTIVE_ITEM_TAG);
    setDangerousRightText(resultText);
  }, [receiveAPIDangerousTagText]);

  return (
    <DivInlineBody $isVisible={isVisible}>
      <DivInlineFlex>
        <LabelLeftTitle>
          기사 초안
          <DivButtonMode onClick={onMouseDownEvent_Copy}>
            <ImageIcon $isButton $marginRight={'5px'} src={'/assets/Icon_Contents_Copy.png'} />
            {'본문 내용 복사하기'}
          </DivButtonMode>
          <DivDisplayPosition $isVisible={isVisibleTooltip} $positionTop={mousePosition_Y + 10} $positionLeft={mousePosition_X}>
            <ImageIcon $isButton $width={'80px'} src={'/assets/Image_Tooltip_Popup.png'} />
          </DivDisplayPosition>
        </LabelLeftTitle>

        <DivWidthLikeMargin32 />

        <LabelLeftTitle>
          {rightTitle}
          <ImageIcon $isButton $width={'20px'} $marginLeft={'14px'} src={'/assets/Icon_Close_Button.png'} onClick={onCloseCallback} />
        </LabelLeftTitle>
      </DivInlineFlex>

      <DivInlineFlex>
        <DivBlockDisplay $display={'block'}>
          <DivLeftTextareaLike>{leftPureStringText}</DivLeftTextareaLike>

          <LabelBottomNotification $marginTop={'15px'}> 해당 기사는 [기사 작성 원칙]과 [표현 가이드]가 적용되어 생성된 기사입니다. </LabelBottomNotification>
          <LabelBottomNotification> 내용 영역 선택 시 부분적인 수정이 가능합니다. </LabelBottomNotification>
        </DivBlockDisplay>

        <DivWidthLikeMargin32 />

        <DivBlockDisplay $display={'block'} $content={'width: 50%'}>
          <DivRightContentArea
            $content={(onSpinner ? '' : 'width: calc(100% - 48px);') + 'justify-content: center; background-color:' + Readonly.Color.Box_FCFDFF}>
            <ComponentWaitingSpinner isVisible={onSpinner} topText={'표현을 다듬는 중 입니다.'} />

            <DivBlockDisplay $display={onSpinner === false ? 'block' : 'none'} $content={'width : 100%'}>
              <DivDangerousRightTextarea>
                <div dangerouslySetInnerHTML={{ __html: dangerousRightText }}></div>
              </DivDangerousRightTextarea>
            </DivBlockDisplay>
          </DivRightContentArea>

          <DivBlockDisplay $display={dangerousRightText && dangerousRightText.length > 1 && onSpinner === false ? 'block' : 'none'} $content={'width: 100%'}>
            <ComponentHalfContentLeftTwoButton
              leftButtonText={'재검사하기'}
              onLeftClick={onPostHookAPI}
              rightButtonText={'적용하기'}
              onRightClick={onApplyCallback}
            />
          </DivBlockDisplay>
        </DivBlockDisplay>
      </DivInlineFlex>
    </DivInlineBody>
  );
};

const DivInlineBody = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'inline-flex' : 'none')};
  min-height: 150px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  width: 100%;
`;

const DivBlockDisplay = styled.div<CustomProperties>`
  display: ${(props) => props.$display};
  width: 50%;
  ${(props) => props.$content};
`;

const DivInlineFlex = styled.div`
  display: inline-flex;
  width: 100%;
`;

const DivWidthLikeMargin32 = styled.div<CustomProperties>`
  display: inline-block;
  width: 32px;
  min-width: 32px;
`;

const LabelLeftTitle = styled.label<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  display: inline-flex;
  width: 50%;
  justify-content: space-between;
  ${Readonly.Style.Basic_White_Font};
  letter-spacing: -0.002em;
  margin-top: 30px;
  margin-bottom: 15px;
  color: ${Readonly.Color.Black_Zero};
`;

const DivButtonMode = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: 13px;
  letter-spacing: 0.0194em;
  color: ${Readonly.Color.Black_Zero};
  cursor: pointer;
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
  min-width: 420px;
`;

const LabelFont = `
	display: block;
	${Readonly.Style.Basic_White_Font}
	color: ${Readonly.Color.Black_Zero};
	font-size: 17px;
	font-weight: 400;
`;

const DivLeftTextareaLike = styled.div`
  display: inline-flex;
  background-color: ${Readonly.Color.Box_FCFDFF};
  border: solid 1px ${Readonly.Color.Box_EOE5EF};
  padding: 24px;
  border-radius: 6px;
  line-height: 22px;
  min-height: 458px;
  resize: none;
  outline: none;
  white-space: pre-line;
  ${LabelFont};
  overflow: scroll;
`;

const DivDangerousRightTextarea = styled.div`
  line-height: 22px;
  height: min-content;
  resize: none;
  outline: none;
  white-space: pre-line;
  ${LabelFont};
  width: 100%;
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

const ImageIcon = styled.img<CustomProperties>`
  width: ${(props) => props.$width ?? '20px'};
  object-fit: contain;
  margin-bottom: ${(props) => props.$marginBottom};
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
  ${(props) => (props.$isButton ? 'cursor: pointer' : '')};
`;

const DivRightContentArea = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  flex-wrap: wrap;
  height: fit-content;
  border: solid 1px ${Readonly.Color.Blue_1F68F6};
  padding: 24px;
  border-radius: 6px;
  ${(props) => props.$content};
`;
