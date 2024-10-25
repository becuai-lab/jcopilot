import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Readonly, { ENUM_API_INPUT_TYPE, ENUM_BUTTON_ACTIVE_INDEX } from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { ComponentBlueColorLabel } from 'Component/Component_BlueColorLabel';
import { ComponentBlueBorderButton } from 'Component/Component_BlueBorderButton';
import { ComponentBluePointButton } from 'Component/Component_BluePointButton';
import { ComponentWaitingSpinner } from 'Component/Component_WaitingForGenerator';
import { ComponentInputTextArea } from 'Component/Component_InputTextArea';
import { ComponentDragAndDropFileUpload } from 'Component/Component_DragAndDropFileUpload';
import PageDraftArticlesDetails from './PageDraftArticlesDetails';
import { Interface_SEO_Visible } from './PageMainFrame';
import { ComponentCommonPopup } from 'Component/Component_CommonPopup';

import { PostHook_CreationDraftArticles } from 'Server/AxiosAPI';
import API_URL from 'Server/API_URL';

import { useApiActionStore, useDepthBackStore, useMenuSelectedStore } from 'Store/MenuStore';

const TEXT_WAITING_FOR_GENERATE = 'AI가 기사 초안을 생성하고 있습니다.',
  FONT_SIZE_17PX = '17px';

export const PageDraftArticles = ({
  isVisible,
  stateSetter,
  onAPIState,
  pageMover,
  isHideMode,
  companyInfo,
  isEditStatus,
  setIsEditStatus,
}: Interface_SEO_Visible) => {
  const [buttonIndex, setButtonIndex] = useState<number>(ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE);
  const [nextButtonIndex, setNextButtonIndex] = useState<number>(ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE);
  const [uploadedFile, setUploadedFile] = useState<File | null>();
  const [fileName, setFileName] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [originTextInput, setOriginTextInput] = useState<string>('');
  const [isInputReset, setInputReset] = useState<boolean>(false);
  const [isGenerating, setGenerating] = useState<boolean>(false);
  const [isDetailFlow, setDetailFlow] = useState<boolean>(false);
  const [isDetailFlowDraftSpinner, setDetailFlowDraftSpinner] = useState<boolean>(false);
  const [draftType_1or2, setDraftType] = useState<ENUM_API_INPUT_TYPE>(ENUM_API_INPUT_TYPE.NONE);
  const [popupText, setPopupText] = useState<string>('');
  const [popupRightButtonText, setPopupRightButtonText] = useState<string>('');

  const { pageIndex, setPageIndex } = useMenuSelectedStore();
  const { apiActionPage, setApiActionPage, setApiCallComplete } = useApiActionStore();

  const { depthBack, setDepthBack } = useDepthBackStore();

  useEffect(() => {
    if (depthBack) {
      setDepthBack(false);

      setGenerating(false);
      setDetailFlow(false);
      setDetailFlowDraftSpinner(false);
      setIsEditStatus(false);
      setApiActionPage(pageIndex);
      setApiCallComplete(true);

      setDraftType(ENUM_API_INPUT_TYPE.NONE);
    }
  }, [depthBack]);

  const apiCallbackFunction = () => {
    setGenerating(false);
    setDetailFlow(true);
    setDetailFlowDraftSpinner(false);

    setApiActionPage(pageIndex);
    setApiCallComplete(true);
  };

  const apiCallbackFailFunction = () => {
    setGenerating(false);
    setDetailFlow(false);
    setDetailFlowDraftSpinner(false);
    setIsEditStatus(false);
    setApiActionPage(pageIndex);
    setApiCallComplete(true);

    setDraftType(ENUM_API_INPUT_TYPE.NONE);
  };

  const { returnAPIData, returnSeqID, error, onPostHookAPI_BinaryBlob, onPostHookAPI_InputText } = PostHook_CreationDraftArticles(
    API_URL.Draft.Creation,
    {
      input_text: textInput.length === 0 ? (draftType_1or2 === 1 ? textInput : originTextInput) : textInput,
      input_type_1or2: draftType_1or2,
      uploaded_file: uploadedFile ?? null,
    },
    companyInfo,
    setPopupText,
    apiCallbackFunction,
    apiCallbackFailFunction,
  );

  useEffect(() => {
    if (returnAPIData && returnAPIData.length > 0) {
      setIsEditStatus(true);
      if (isDetailFlow) {
        if (!(window.location.pathname === '/draft/modify')) {
          window.history.pushState({}, '', window.location.pathname + '/modify');
        }
      }
    }
  }, [returnAPIData, isDetailFlow]);

  useEffect(() => {
    stateSetter(isDetailFlow && isVisible);
  }, [isDetailFlow, isVisible]);

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
    if (draftType_1or2 === ENUM_API_INPUT_TYPE.FILE_UPLOAD_1) {
      setIsEditStatus(true);
      onPostHookAPI_BinaryBlob();
    } else if (draftType_1or2 === ENUM_API_INPUT_TYPE.TEXT_INPUT_2) {
      setIsEditStatus(true);
      onPostHookAPI_InputText();
    } else {
    }
  }, [draftType_1or2]);

  useEffect(() => {
    if (onAPIState && onAPIState < 1) return;

    let needSpinner = false;

    if (draftType_1or2 === ENUM_API_INPUT_TYPE.FILE_UPLOAD_1) {
      needSpinner = true;
      setIsEditStatus(true);
      onPostHookAPI_BinaryBlob(true);
    } else if (draftType_1or2 === ENUM_API_INPUT_TYPE.TEXT_INPUT_2) {
      needSpinner = true;
      setIsEditStatus(true);
      onPostHookAPI_InputText(true);
    }

    setDetailFlowDraftSpinner(needSpinner);
  }, [onAPIState]);

  const onClick_DraftArticleGenerator = () => {
    setPopupRightButtonText('');

    if (buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE && fileName.length > 0) {
      setDraftType(ENUM_API_INPUT_TYPE.FILE_UPLOAD_1);
    } else if (buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.TEXT_INPUT_ACTIVE && textInput.length > Readonly.Value.InputLength_Minimum_100) {
      setDraftType(ENUM_API_INPUT_TYPE.TEXT_INPUT_2);
    } else {
      setPopupText(buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE ? '첨부된 파일이 없습니다.' : '최소 100자 이상의 내용을 입력해주세요.');
      setGenerating(false);
      return;
    }

    setGenerating(true);
  };

  return (
    <>
      <DivDisplay $isVisible={isVisible} $content={'height : 100%'}>
        <DivDisplay $isVisible={isDetailFlow === false}>
          <LabelTitle $fontSize={'40px'} $marginTop={'20px'}>
            안녕하세요,&nbsp;
            {<ComponentBlueColorLabel text={'홍길동'} fontSize={'40px'} />}
            &nbsp;기자님!
          </LabelTitle>
          <LabelTitle $marginTop={'20px'}>
            Jcopilot과 함께하는&nbsp;
            {<ComponentBlueColorLabel text={'손쉬운 기사 작성'} fontSize={'22px'} />}을 시작하세요.
          </LabelTitle>
        </DivDisplay>

        <DivDisplay $isVisible={isDetailFlow === false} $content={'height : 80%'}>
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

          <DivDisplay $isVisible={buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.FILE_UPLOAD_ACTIVE}>
            <ComponentDragAndDropFileUpload
              leftText={'작성할 기사의'}
              middleBlueText={'보도자료를 첨부'}
              rightText={'해주세요.'}
              stateSetterFile={setUploadedFile}
              stateSetterName={setFileName}
              fileName={fileName}
              marginTop={'15px'}
              isGenerating={isGenerating}
              uploadedFileSize={uploadedFile?.size ?? 0}
              waitingNotificationText={TEXT_WAITING_FOR_GENERATE}
              calcBoxHeight={'900px'}
            />

            <LabelSubTitle $marginTop={'15px'} $fontSize={'15px'}>
              - 이 기술은 open AI와 BECUAI의 기술을 활용합니다.
            </LabelSubTitle>
            <LabelSubTitle $fontSize={'15px'}>
              - AI 모델에 의해 다양한 데이터를 기반으로 답변을 생성하므로 예상치 못한 부정확, 부적절한 정보가 결과에 포함될 수 있습니다.
            </LabelSubTitle>
            <LabelSubTitle $marginBottom={'34px'} $fontSize={'15px'}>
              - 보도자료의 용량이 너무 큰 경우 AI 모델에 의하여 첨부가 불가능 할 수 있습니다.
            </LabelSubTitle>
          </DivDisplay>

          <DivDisplay $isVisible={buttonIndex === ENUM_BUTTON_ACTIVE_INDEX.TEXT_INPUT_ACTIVE} $content={'height : inherit; min-height : 420px'}>
            <LabelTitle $fontSize={'18px'} $marginTop={'46px'} $marginLeft={'left'} $marginBottom={'16px'}>
              작성할 기사의&nbsp;
              {<ComponentBlueColorLabel text={'보도자료를 입력'} fontSize={'18px'} />}
              해주세요.
            </LabelTitle>

            <DivTextInput $calcHeight={'217px'}>
              <DivDisplay $isVisible={isGenerating === false} $content={'height : 100%'}>
                <ComponentInputTextArea
                  height={'calc(100% - 100px)'}
                  placeholder={'100자 이상 4000자 이하의 텍스트를 지원합니다.'}
                  stateSetter={setTextInput}
                  originSetter={setOriginTextInput}
                  inputMaxLength={4000}
                  needLineWithLengthText
                  inputMinHeight={'fit-content'}
                  inputReset={isInputReset}
                  isPositionAbsolute
                />

                <LabelSubTitle $marginTop={'15px'} $fontSize={'15px'}>
                  - 이 기술은 open AI와 BECUAI의 기술을 활용합니다.
                </LabelSubTitle>
                <LabelSubTitle $fontSize={'15px'}>
                  - AI 모델에 의해 다양한 데이터를 기반으로 답변을 생성하므로 예상치 못한 부정확, 부적절한 정보가 결과에 포함될 수 있습니다.
                </LabelSubTitle>
                <LabelSubTitle $marginBottom={'34px'} $fontSize={'15px'}>
                  - 보도자료의 용량이 너무 큰 경우 AI 모델에 의하여 첨부가 불가능 할 수 있습니다.
                </LabelSubTitle>
              </DivDisplay>

              <ComponentWaitingSpinner isVisible={isGenerating} topText={TEXT_WAITING_FOR_GENERATE} />
            </DivTextInput>
          </DivDisplay>
        </DivDisplay>

        <PageDraftArticlesDetails
          isVisible={isDetailFlow}
          fileName={fileName}
          uploadedFileSize={uploadedFile?.size ?? 0}
          textInput={textInput}
          originTextInput={originTextInput}
          originDraftText={returnAPIData}
          seqID={returnSeqID}
          draftType_1or2={draftType_1or2}
          pageMover={pageMover}
          onInnerSpinner={isDetailFlowDraftSpinner}
          stateSetter={setTextInput}
          companyInfo={companyInfo}
        />

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
            setUploadedFile(null);
            setFileName('');
            setTextInput('');
            setInputReset(!isInputReset);
            setButtonIndex(nextButtonIndex);
            setIsEditStatus(false);
          }}
        />
      </DivDisplay>

      <ComponentBluePointButton
        isVisible={isVisible && isDetailFlow === false}
        onClickEvent={onClick_DraftArticleGenerator}
        text={'기사 초안 생성하기'}
        isActive={isGenerating === false}
        marginBottom={'70px'}
      />
    </>
  );
};

const DivDisplay = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  ${(props) => props.$content};
`;

const DivTextInput = styled.div<CustomProperties>`
  min-height: 205px;
  border: solid 1px ${Readonly.Color.Box_EOE5EF};
  outline-color: ${Readonly.Color.Box_EOE5EF};
  border-radius: 6px;
  height: calc(100% - ${(props) => props.$calcHeight});
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

const DivMiddleButtonArea = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  margin-top: 55px;
`;

const LabelTitle = styled.label<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: ${(props) => props.$fontSize ?? '22px'};
  margin-top: ${(props) => props.$marginTop};
  color: ${Readonly.Color.Black_Zero};
  justify-content: ${(props) => props.$marginLeft};
  margin-bottom: ${(props) => props.$marginBottom};
`;
