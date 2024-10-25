import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import Readonly, { ENUM_API_INPUT_TYPE, ENUM_BUTTON_ACTIVE_INDEX } from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { ComponentBlueColorLabel } from 'Component/Component_BlueColorLabel';
import { ComponentBlueBorderButton } from 'Component/Component_BlueBorderButton';
import { ComponentBluePointButton } from 'Component/Component_BluePointButton';
import { ComponentWaitingSpinner } from 'Component/Component_WaitingForGenerator';
import { ComponentInputTextArea } from 'Component/Component_InputTextArea';
import { ComponentDragAndDropFileUpload } from 'Component/Component_DragAndDropFileUpload';
import { ComponentUploadFileInformation } from 'Component/Component_UploadFileInformation';
import { CallbackTimeout } from 'Utility/SetTimeout';
import { ComponentDropdownMenuButton } from 'Component/Component_DropdownMenuButton';
import { Interface_SEO_Visible } from './PageMainFrame';
import { ComponentCommonPopup } from 'Component/Component_CommonPopup';
import { DangerousClipboard } from 'Utility/DangerousClipboard';

import { PostHook_CreationInterview, PostHook_InterviewToneChange } from 'Server/AxiosAPI';
import API_URL from 'Server/API_URL';
import { useApiActionStore, useDepthBackStore, useMenuSelectedStore } from 'Store/MenuStore';

const TEXT_WAITING_FOR_GENERATE = 'AI가 취재 질의를 생성하고 있습니다.',
  ARRAY_INTERVIEW_TONE_FIVE_MENU = ['공식적', '친화적', '비판적', '전문적', '의심적'],
  TOOLTIP_LIFE_TIME_SECOND = 3,
  FONT_SIZE_17PX = '17px';

export const PageInterview = ({ isVisible, stateSetter, onAPIState, isHideMode, companyInfo, isEditStatus, setIsEditStatus }: Interface_SEO_Visible) => {
  const { pageIndex, setPageIndex } = useMenuSelectedStore();
  const { apiActionPage, setApiActionPage, setApiCallComplete } = useApiActionStore();

  const [buttonIndex, setButtonIndex] = useState<number>(ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE);
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [fileName, setFileName] = useState<string>('');
  const [interviewPurposeText, setInterviewPurposeText] = useState<string>('');
  const [interviewType_1or2, setInterviewType] = useState<ENUM_API_INPUT_TYPE>(ENUM_API_INPUT_TYPE.NONE);
  const [textInput, setTextInput] = useState<string>('');
  const [isGenerating, setGenerating] = useState<boolean>(false);
  const [isInterviewDetail, setInterviewDetail] = useState<boolean>(false);
  const [copyTextFromArray, setCopyTextFromArray] = useState<string>('');
  const [isVisibleDropdown, setVisibleDropdown] = useState<boolean>(false);
  const [onSpinner, setSpinner] = useState<boolean>(false);
  const [spinnerText, setSpinnerText] = useState<string>(TEXT_WAITING_FOR_GENERATE);
  const [requestInterviewItem, setRequestInterviewItem] = useState<string[]>([]);
  const [dropdownIndex, setDropdownIndex] = useState<number>(-1);
  const [popupText, setPopupText] = useState<string>('');

  const [isVisibleTooltip, setVisibleTooltip] = useState<boolean>(false);
  const [mousePosition_X, setMousePosition_X] = useState<number>(0);
  const [mousePosition_Y, setMousePosition_Y] = useState<number>(0);

  const [isInputReset, setInputReset] = useState<boolean>(false);
  const [popupRightButtonText, setPopupRightButtonText] = useState<string>('');
  const [nextButtonIndex, setNextButtonIndex] = useState<number>(ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE);

  const onMouseDownEvent_Copy = async (event: React.MouseEvent<HTMLImageElement>) => {
    const rectangle = event.currentTarget.getClientRects()?.item(0);
    setMousePosition_X((rectangle?.x ?? 0) + (rectangle?.width ?? 0) * 0.25);
    setMousePosition_Y((rectangle?.y ?? 0) + 10);

    if (isVisibleTooltip) return;

    setVisibleTooltip(true);
    CallbackTimeout(TOOLTIP_LIFE_TIME_SECOND, () => {
      setVisibleTooltip(false);
    });

    DangerousClipboard(copyTextFromArray);
  };

  const onAPIDivideCaller = (tone?: string, endpoint?: string, interviewItemArray?: string[]) => {
    let needSpinner = false;

    if (interviewType_1or2 === ENUM_API_INPUT_TYPE.FILE_UPLOAD_1) {
      needSpinner = true;
      setIsEditStatus(true);
      onPostHookAPI_BinaryBlob(tone, endpoint, interviewItemArray);
    } else if (interviewType_1or2 === ENUM_API_INPUT_TYPE.TEXT_INPUT_2) {
      needSpinner = true;
      setIsEditStatus(true);
      onPostHookAPI_InputText(tone, endpoint, interviewItemArray);
    } else {
    }

    setSpinner(needSpinner);
  };

  const getNewArrayFrom = (fromArray: string[]) => {
    const count = fromArray.length;
    const returnNewArray: string[] = [];
    let copyValue = '';

    for (let i = 0; i < count; ++i) {
      returnNewArray.push(fromArray[i]);
      copyValue += fromArray[i] + '\n';
    }

    setCopyTextFromArray(copyValue);
    return [...returnNewArray];
  };

  const { depthBack, setDepthBack } = useDepthBackStore();
  useEffect(() => {
    if (depthBack) {
      setDepthBack(false);

      setGenerating(false);
      setSpinner(false);
      setIsEditStatus(false);
      setApiActionPage(pageIndex);
      setApiCallComplete(true);
      setInterviewDetail(false);

      setInterviewType(ENUM_API_INPUT_TYPE.NONE);
    }
  }, [depthBack, isInterviewDetail]);

  const apiCallbackFunction = () => {
    setGenerating(false);
    setSpinner(false);

    setApiActionPage(pageIndex);
    setApiCallComplete(true);
  };

  const apiCallbackFailFunction = () => {
    setGenerating(false);
    setSpinner(false);
    setIsEditStatus(false);
    setApiActionPage(pageIndex);
    setApiCallComplete(true);

    setInterviewType(ENUM_API_INPUT_TYPE.NONE);
  };

  const { returnAPIInterviewTextArray, returnAPIAddInterviewItem, errorAPIInterview, onPostHookAPI_BinaryBlob, onPostHookAPI_InputText } =
    PostHook_CreationInterview(
      API_URL.Interview.Creation,
      {
        input_text: textInput,
        input_type_1or2: interviewType_1or2,
        interview_purpose: interviewPurposeText,
        uploaded_file: uploadedFile ?? null,
      },
      companyInfo,
      setPopupText,
      apiCallbackFunction,
      apiCallbackFailFunction,
    );

  const { returnAPIChangeToneArray, errorAPIToneArray, onPostHookAPI_ToneJson } = PostHook_InterviewToneChange(
    API_URL.Interview.Tone,
    companyInfo,
    setPopupText,
    apiCallbackFunction,
  );

  const onClick_InterviewGenerator = () => {
    setSpinnerText('');

    if (interviewPurposeText.length < 1) {
      setPopupText('취재 목적을 작성해주세요.');

      return;
    }

    if (buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE && fileName.length > 0) {
      setSpinnerText(TEXT_WAITING_FOR_GENERATE);
      setInterviewType(ENUM_API_INPUT_TYPE.FILE_UPLOAD_1);
    } else if (buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.TEXT_INPUT_ACTIVE && textInput.length > Readonly.Value.InputLength_Minimum_100) {
      setSpinnerText(TEXT_WAITING_FOR_GENERATE);
      setInterviewType(ENUM_API_INPUT_TYPE.TEXT_INPUT_2);
    } else {
      setGenerating(false);

      if (buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE) {
        setPopupText('첨부된 파일이 없습니다.');

        return;
      } else {
        setPopupText('최소 100자 이상의 내용을 입력해주세요.');

        return;
      }
    }

    setGenerating(true);
  };

  useEffect(() => {
    if (returnAPIInterviewTextArray && returnAPIInterviewTextArray.length > 0) {
      setIsEditStatus(true);
      if (isInterviewDetail) {
        if (!(window.location.pathname === '/interview/modify')) {
          window.history.pushState({}, '', window.location.pathname + '/modify');
        }
      }
    }
  }, [returnAPIInterviewTextArray, isInterviewDetail]);

  useEffect(() => {
    if (nextButtonIndex === buttonIndex) return;
    else if (nextButtonIndex === ENUM_BUTTON_ACTIVE_INDEX.TEXT_INPUT_ACTIVE) {
      if (!uploadedFile || uploadedFile?.size < 1) {
        setPopupText('');
        setPopupRightButtonText('');
        setButtonIndex(nextButtonIndex);

        return;
      }
    } else {
      if (!textInput || textInput?.length < 1) {
        setPopupText('');
        setPopupRightButtonText('');
        setButtonIndex(nextButtonIndex);

        return;
      }
    }

    setPopupRightButtonText('초기화');
    setPopupText('형식 변환 시 기존 자료가 초기화 됩니다.\n해당 자료를 초기화 하시겠습니까?');
  }, [nextButtonIndex]);

  useEffect(() => {
    onAPIDivideCaller();
    setSpinnerText(TEXT_WAITING_FOR_GENERATE);
  }, [interviewType_1or2, onAPIState]);

  useEffect(() => {
    stateSetter(isInterviewDetail && isVisible);
  }, [isInterviewDetail, isVisible]);

  useEffect(() => {
    const isDetailView = returnAPIInterviewTextArray && returnAPIInterviewTextArray?.length > 0;
    setInterviewDetail(isDetailView);

    if (isDetailView) setRequestInterviewItem(getNewArrayFrom(returnAPIInterviewTextArray));
  }, [returnAPIInterviewTextArray]);

  useEffect(() => {
    if (!requestInterviewItem || requestInterviewItem.length < 1) return;

    const count = requestInterviewItem.length;
    const forRequestArray: string[] = [];
    let resultText = '';

    for (let i = 0; i < count; ++i) {
      forRequestArray.push(requestInterviewItem[i]);
      resultText += requestInterviewItem[i] + '\n';
    }

    forRequestArray.push(returnAPIAddInterviewItem);
    setRequestInterviewItem([...forRequestArray]);
    setCopyTextFromArray(resultText);
  }, [returnAPIAddInterviewItem]);

  useEffect(() => {
    setRequestInterviewItem(getNewArrayFrom(returnAPIChangeToneArray));
  }, [returnAPIChangeToneArray]);

  return (
    <>
      <DivDisplayAndContent $isVisible={isVisible} $content={'height:min-content;'}>
        <DivDisplayAndContent $isVisible={isInterviewDetail === false}>
          <LabelTitle $fontSize={'40px'} $marginTop={'20px'}>
            안녕하세요,&nbsp;
            {<ComponentBlueColorLabel text={'홍길동'} fontSize={'40px'} />}
            &nbsp;기자님!
          </LabelTitle>
          <LabelTitle $marginTop={'20px'}>
            Jcopilot과 함께하는&nbsp;
            {<ComponentBlueColorLabel text={'손쉬운 취재질의 생성'} fontSize={'22px'} />}을 시작하세요.
          </LabelTitle>
        </DivDisplayAndContent>

        <DivDisplayAndContent $isVisible={isInterviewDetail === false} $content={'width: 100%; height: 100%;'}>
          <DivMiddleButtonArea>
            {Readonly.Value.Array_ButtonName.map((item, key) => (
              <ComponentBlueBorderButton
                key={key}
                index={key}
                isPrimary={key === 0}
                fontSize={FONT_SIZE_17PX}
                text={item}
                isActive={key === buttonIndex}
                stateSetter={setNextButtonIndex}
              />
            ))}
          </DivMiddleButtonArea>

          <DivDisplayAndContent $isVisible={buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE} $content={'margin-top : 15px'}>
            <ComponentDragAndDropFileUpload
              leftText={'사전에 확보한'}
              middleBlueText={'정보를 첨부'}
              rightText={'해주세요.'}
              stateSetterFile={setUploadedFile}
              stateSetterName={setFileName}
              fileName={fileName}
              isGenerating={isGenerating}
              uploadedFileSize={uploadedFile?.size ?? 0}
              waitingNotificationText={TEXT_WAITING_FOR_GENERATE}
              calcBoxHeight={'900px'}
              marginTop={'15px'}
            />
          </DivDisplayAndContent>

          <DivDisplayAndContent $isVisible={buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.TEXT_INPUT_ACTIVE}>
            <LabelTitle $fontSize={'18px'} $marginTop={'46px'} $marginLeft={'left'}>
              {<ComponentBlueColorLabel text={'사전에 확보한 정보를 입력'} fontSize={'18px'} />}
              해주세요.
            </LabelTitle>

            <DivTextInput>
              <DivDisplayAndContent $isVisible={isGenerating === false}>
                <ComponentInputTextArea
                  placeholder={'100자 이상 4000자 이하의 텍스트를 지원합니다.'}
                  stateSetter={setTextInput}
                  height={'calc(100% - 100px)'}
                  padding={'20px 20px 0 20px'}
                  inputMaxLength={4000}
                  needLineWithLengthText
                  inputMinHeight={'234px'}
                  inputReset={isInputReset}
                />
              </DivDisplayAndContent>

              <ComponentWaitingSpinner height="290px" isVisible={isGenerating} topText={TEXT_WAITING_FOR_GENERATE} />
            </DivTextInput>
          </DivDisplayAndContent>

          <DivInterviewPurpose>
            <LabelTitle $marginLeft={'left'} $fontSize={'14px'} $marginBottom={'6px'}>
              취재 목적을 알려주세요.
            </LabelTitle>

            <ComponentInputTextArea
              placeholder={'큰따옴표(‘”)는 제외하고 기사에 포함한 발언 내용을 입력합니다.'}
              isBorder
              inputMaxLength={200}
              textLengthMarginBottom={'16px'}
              padding={'16px'}
              height={'100px'}
              backgroundColor={Readonly.Color.White_FFFFFF}
              stateSetter={setInterviewPurposeText}
              inputReset={isInputReset}
            />
          </DivInterviewPurpose>

          <LabelSubTitle $marginTop={'15px'} $fontSize={'15px'}>
            - 이 기술은 open AI와 BECUAI의 기술을 활용합니다.
          </LabelSubTitle>
          <LabelSubTitle $fontSize={'15px'}>
            - AI 모델에 의해 다양한 데이터를 기반으로 답변을 생성하므로 예상치 못한 부정확, 부적절한 정보가 결과에 포함될 수 있습니다.
          </LabelSubTitle>
          <LabelSubTitle $marginBottom={'34px'} $fontSize={'15px'}>
            - 보도자료의 용량이 너무 큰 경우 AI 모델에 의하여 첨부가 불가능 할 수 있습니다.
          </LabelSubTitle>
        </DivDisplayAndContent>

        <DivDisplayAndContent $isVisible={isInterviewDetail} $content={isHideMode ? 'width: calc(100vw - 140px)' : 'width: calc(100vw - 466px)'}>
          <DivInterviewTitle>
            <LabelInterview $minWidth={'fit-content'} $isBold $color={Readonly.Color.Blue_1F68F6}>
              취재목적
            </LabelInterview>
            <DivLine />
            <LabelInterview $width={'100%'} $color={Readonly.Color.Black_Zero}>
              {interviewPurposeText}
            </LabelInterview>
          </DivInterviewTitle>

          <ComponentUploadFileInformation
            isFileUploadType={buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE}
            isVisible
            textInput={textInput}
            titleText={uploadedFile?.name ?? interviewPurposeText}
            isHiddenCloseButton
            uploadedFileSize={uploadedFile?.size ?? 0}
          />

          <DivTopTitle>
            <LabelLeftTitle> 취재질의 </LabelLeftTitle>

            <DivInlineFlex>
              <DivButtonMode onClick={onMouseDownEvent_Copy}>
                <ImageIcon $isButton $marginRight={'5px'} src={'/assets/Icon_Contents_Copy.png'} />
                {'본문 내용 복사하기'}
              </DivButtonMode>

              <DivDisplayPosition $isVisible={isVisibleTooltip} $positionTop={mousePosition_Y + 10} $positionLeft={mousePosition_X}>
                <ImageIcon $isButton $width={'80px'} src={'/assets/Image_Tooltip_Popup.png'} />
              </DivDisplayPosition>

              <DivBorderLine $marginLeft={'14px'} $marginRight={'14px'} />

              <DivButtonMode onClick={() => setVisibleDropdown(!isVisibleDropdown)}>
                <ImageIcon $isButton $marginRight={'5px'} src={'/assets/Icon_Title_Recreation.png'} />
                질의톤 변경하기
              </DivButtonMode>

              {isVisibleDropdown && (
                <ComponentDropdownMenuButton
                  translatePosition={'0, 110px'}
                  isVisible={isVisibleDropdown}
                  nameArray={ARRAY_INTERVIEW_TONE_FIVE_MENU}
                  callbackClickFrom={(index) => {
                    if (index === -999) {
                      setVisibleDropdown(false);
                    } else {
                      setDropdownIndex(index);
                      setVisibleDropdown(false);
                      setSpinner(true);
                      setSpinnerText('질의톤 변경 중 입니다.');

                      onPostHookAPI_ToneJson(ARRAY_INTERVIEW_TONE_FIVE_MENU[index], requestInterviewItem);
                    }
                  }}
                />
              )}
            </DivInlineFlex>
          </DivTopTitle>

          <DivInterviewBox>
            <ComponentWaitingSpinner isVisible={onSpinner} topText={spinnerText} />

            {onSpinner === false &&
              requestInterviewItem?.length > 0 &&
              requestInterviewItem.map((item, key) => <LabelInterviewItem key={key}>{key + 1 + '. ' + item}</LabelInterviewItem>)}
          </DivInterviewBox>

          <DivAddInterviewCreation
            onClick={() => {
              onAPIDivideCaller(ARRAY_INTERVIEW_TONE_FIVE_MENU[dropdownIndex], API_URL.Interview.AddItem, requestInterviewItem);
              setSpinnerText('추가 질의를 생성하고 있습니다.');
            }}>
            추가 질문 생성하기
          </DivAddInterviewCreation>
        </DivDisplayAndContent>

        <ComponentCommonPopup
          notificationText={popupText}
          rightButtonName={popupRightButtonText}
          onClick_Primary={() => {
            setPopupText('');
            setPopupRightButtonText('');
            setNextButtonIndex(buttonIndex);
          }}
          OnClick_AnyOption={() => {
            setPopupText('');
            setPopupRightButtonText('');
            setInterviewPurposeText('');
            setUploadedFile(null);
            setFileName('');
            setTextInput('');
            setInputReset(!isInputReset);
            setButtonIndex(nextButtonIndex);
            setIsEditStatus(false);
          }}
        />
      </DivDisplayAndContent>

      <ComponentBluePointButton
        isVisible={isVisible && isInterviewDetail === false}
        onClickEvent={onClick_InterviewGenerator}
        text={'취재질의 생성하기'}
        isActive={isGenerating === false}
        marginBottom={'70px'}
      />
    </>
  );
};

const DivDisplayAndContent = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  ${(props) => props.$content};
`;

const DivTopTitle = styled.div`
  display: inline-flex;
  width: 100%;
  margin-top: 30px;
  margin-bottom: 15px;
`;

const LabelSubTitle = styled.label<CustomProperties>`
  margin-top: ${(props) => props.$marginTop};
  ${Readonly.Style.Basic_White_Font};
  font-size: ${(props) => props.$fontSize ?? '13px'};
  font-weight: 500;
  color: ${Readonly.Color.Gray_777777};
  display: block;
  height: 18px;
  margin-bottom: ${(props) => props.$marginBottom};
`;

const DivAddInterviewCreation = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  border: solid 1px ${Readonly.Color.Blue_1F68F6};
  padding-top: 16px;
  padding-bottom: 16px;
  height: 18px;
  ${Readonly.Style.Basic_White_Font}
  font-size: 15px;
  color: ${Readonly.Color.Blue_1F68F6};
  margin-top: 10px;
  border-radius: 6px;
  cursor: pointer;
`;

const LabelLeftTitle = styled.label<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  display: inline-flex;
  width: 100%;
  justify-content: space-between;
  ${Readonly.Style.Basic_White_Font};
  letter-spacing: -0.002em;
  color: ${Readonly.Color.Black_Zero};
  margin-left: ${(props) => props.$marginLeft};
`;

const LabelInterviewItem = styled.label`
  ${Readonly.Style.Basic_White_Font};
  font-size: ${FONT_SIZE_17PX};
  line-height: 22px;
  font-weight: 400;
  color: ${Readonly.Color.Black_Zero};
  display: block;
`;

const DivButtonMode = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: 13px;
  letter-spacing: 0.0194em;
  color: ${Readonly.Color.Black_Zero};
  cursor: pointer;
  min-width: fit-content;
`;

const DivInterviewBox = styled.div`
  height: fit-content;
  min-height: 110px;
  border-radius: 6px;
  border: solid 1px ${Readonly.Color.Gray_E3E6F0};
  background-color: ${Readonly.Color.Box_FCFDFF};
  padding: 24px;
  max-height: 425px;
  overflow: overlay;
  overflow-x: hidden;
`;

const DivBorderLine = styled.div<CustomProperties>`
  border-left: solid 1px ${Readonly.Color.Dashed_C8CFE8};
  height: 16px;
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
`;

const DivInlineFlex = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
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

const DivTextInput = styled.div`
  height: min-content;
  margin-top: 16px;
  border: solid 1px ${Readonly.Color.Box_EOE5EF};
  outline-color: ${Readonly.Color.Box_EOE5EF};
  border-radius: 6px;
`;

const DivInterviewTitle = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  border-radius: 10px;
  border: solid 1px ${Readonly.Color.Box_EOE5EF};
  background-color: ${Readonly.Color.Gray_E3E6F0};
  height: 18px;
  padding: 36px 24px 36px 24px;
  justify-content: flex-start;
  margin-bottom: 33.5px;
`;

const DivLine = styled.div`
  height: 20px;
  border: solid 1px ${Readonly.Color.InterviewLine_C2D5F4};
  margin-left: 20px;
  margin-right: 20px;
`;

const LabelInterview = styled.label<CustomProperties>`
  ${Readonly.Style.Basic_White_Font};
  font-size: 16px;
  color: ${(props) => props.$color};
  font-weight: ${(props) => (props.$isBold ? '' : '400')};

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: ${(props) => props.$width};
  min-width: ${(props) => props.$minWidth};
`;

const DivInterviewPurpose = styled.div`
  margin-top: 15px;
  padding: 20px;
  border: solid 1px ${Readonly.Color.Box_EOE5EF};
  background-color: ${Readonly.Color.Box_FCFDFF};
  border-radius: 6px;
`;

const DivMiddleButtonArea = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  margin-top: 55px;
`;

const LabelTitle = styled.label<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: ${(props) => props.$fontSize ?? '22px'};
  margin-top: ${(props) => props.$marginTop};
  margin-bottom: ${(props) => props.$marginBottom};
  color: ${Readonly.Color.Black_Zero};
  justify-content: ${(props) => props.$marginLeft};
`;
