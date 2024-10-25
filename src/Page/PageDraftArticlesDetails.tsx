import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { ComponentUploadFileInformation } from '../Component/Component_UploadFileInformation';
import { ComponentLeftTitleRightButtonAndTextarea, ComponentSpinnerInTheBox } from '../Component/Component_LeftTitleRightButtonAndTextarea';
import { ComponentDropdownMenuButton } from 'Component/Component_DropdownMenuButton';

import API_URL from 'Server/API_URL';
import {
  PostHook_CreationDraftArticleKeyword,
  PostHook_CreationDraftArticleRule,
  PostHook_CreationDraftArticleSummary,
  PostHook_CreationDraftArticleTitle,
} from 'Server/AxiosAPI';
import { ComponentCommonPopup } from 'Component/Component_CommonPopup';
import { useInfo } from 'App';

interface Interface_TopBlackToggleMenu {
  isVisible: boolean;
  fileName: string;
  uploadedFileSize: number;
  textInput: string;
  originTextInput: string;
  originDraftText: string;
  draftType_1or2: number;
  seqID: number;
  pageMover?: (value: React.SetStateAction<number>) => void;
  onInnerSpinner?: boolean;
  stateSetter: (value: React.SetStateAction<string>) => void;
  companyInfo: useInfo;
}

interface Interface_ToggleAPIButton {
  buttonKey: number;
  buttonTitle: string;
  src: string;
  onToggle: boolean;
  toggleState: (value: React.SetStateAction<boolean>) => void;

  isBorder?: boolean;
}

const enum ENUM_TOGGLE_BUTTON {
  NONE = -1,

  RECOMMEND = 0,
  SUMMARY,
  KEYWORD,

  DROPDOWN,

  MOUSE_DRAG,
}

const ITEM_MARGIN_TOP_30PX = '30px';

const PageDraftArticlesDetails = ({
  isVisible,
  fileName,
  uploadedFileSize,
  textInput,
  originTextInput,
  originDraftText,
  seqID,
  draftType_1or2,
  pageMover,
  onInnerSpinner,
  stateSetter,
  companyInfo,
}: Interface_TopBlackToggleMenu) => {
  const [selectedDraftRule, setSelectedDraftRule] = useState<string>('');
  const [onToggleRecommend, setToggleRecommend] = useState<boolean>(false);
  const [onToggleSummary, setToggleSummary] = useState<boolean>(false);
  const [onToggleKeyword, setToggleKeyword] = useState<boolean>(false);
  const [roundButtonDropdown, setRoundButtonDropdown] = useState<boolean>(false);
  const [isDraftRuleDetail, setIsDraftRuleDetail] = useState<boolean>(false);
  const [apiCount, setCount] = useState<number>(0);
  const [popupText, setPopupText] = useState<string>('');

  const [recommendTitle, setRecommenTitle] = useState<string>('');
  const [recommendSubtitle, setRecommenSubtitle] = useState<string>('');
  const [editedDraftText, setEditedDraftText] = useState<string | undefined>(undefined);
  const [draftRuleTitleIndex, setDraftRuleTitleIndex] = useState<number>(-1);

  const setEditedDraftTextEx = (value: React.SetStateAction<string>) => {
    setEditedDraftText(value as React.SetStateAction<string | undefined>);
  };

  useEffect(() => {
    if (editedDraftText && editedDraftText !== textInput) {
      stateSetter(editedDraftText);
    }
  }, [editedDraftText]);

  useEffect(() => {
    if (editedDraftText === undefined || editedDraftText !== originDraftText) {
      setEditedDraftText(originDraftText);
    }
  }, [originDraftText]);

  const [onSpinnerDraft, setSpinnerDraft] = useState<boolean>(false);
  const [onSpinnerTitle, setSpinnerTitle] = useState<boolean>(false);
  const [onSpinnerSummary, setSpinnerSummary] = useState<boolean>(false);
  const [onSpinnerKeyword, setSpinnerKeyword] = useState<boolean>(false);
  const [onSpinnerDropdown, setSpinnerDropdown] = useState<boolean>(false);

  const apiRequestCheck = useCallback(() => {
    if (onSpinnerDropdown || onSpinnerDraft) {
      return true;
    }
  }, [onSpinnerDraft, onSpinnerDropdown]);

  const apiRequestDraftCheck = useCallback(() => {
    if (onSpinnerDraft) {
      return true;
    }
  }, [onSpinnerDraft]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const textReturnChecker = useCallback(() => {
    return editedDraftText ? editedDraftText : originDraftText;
  }, [originDraftText, editedDraftText]);

  const { returnAPITitle, returnAPISubtitle, errorAPITitle, onPostHookAPI_Title } = PostHook_CreationDraftArticleTitle(
    API_URL.Draft.Title,
    { article_text: textReturnChecker() },
    companyInfo,
    setPopupText,
    () => setSpinnerTitle(false),
  );
  useEffect(() => {
    if (returnAPITitle && returnAPITitle.length > 1) setRecommenTitle(returnAPITitle);

    if (returnAPISubtitle && returnAPISubtitle.length > 1) setRecommenSubtitle(returnAPISubtitle);
  }, [returnAPITitle, returnAPISubtitle]);

  const { returnAPISummary, errorAPISummary, onPostHookAPI_Summary } = PostHook_CreationDraftArticleSummary(
    API_URL.Draft.Summary,
    { article_text: textReturnChecker() },
    companyInfo,
    setPopupText,
    () => {
      setCount(apiCount + 1);
      setSpinnerSummary(false);
    },
  );

  const { returnAPIArrayKeyword, errorAPIKeyword, onPostHookAPI_Keyword } = PostHook_CreationDraftArticleKeyword(
    API_URL.Draft.Keyword,
    { article_text: textReturnChecker() },
    companyInfo,
    setPopupText,
    () => {
      setCount(apiCount + 1);
      setSpinnerKeyword(false);
    },
  );

  const { returnAPIDangerousTagRule, returnAPIPureDraftRule, errorAPIDraftRule, onPostHookAPI_Rule } = PostHook_CreationDraftArticleRule(
    { article_text: textReturnChecker() },
    companyInfo,
    setPopupText,
    () => {
      setSpinnerDropdown(false);
      setSelectedDraftRule('');
    },
  );

  const onToggleSwitchFrom = (buttonKey: number) => {
    switch (buttonKey) {
      default:
        return;

      case ENUM_TOGGLE_BUTTON.NONE:
      case ENUM_TOGGLE_BUTTON.DROPDOWN:
      case ENUM_TOGGLE_BUTTON.MOUSE_DRAG:
        return;

      case ENUM_TOGGLE_BUTTON.RECOMMEND:
        setSpinnerTitle(true);
        onPostHookAPI_Title(seqID);

        return;

      case ENUM_TOGGLE_BUTTON.SUMMARY:
        setSpinnerSummary(true);
        onPostHookAPI_Summary(seqID);

        return;

      case ENUM_TOGGLE_BUTTON.KEYWORD:
        setSpinnerKeyword(true);
        onPostHookAPI_Keyword(seqID);

        return;
    }
  };

  const ComponentToggleButton = ({ buttonKey, buttonTitle, src, onToggle, toggleState, isBorder }: Interface_ToggleAPIButton) => {
    const onClickToggle_TitleAPIFlow = () => {
      if (apiRequestDraftCheck()) {
        setPopupText('AI 생성 및 검사 진행중입니다.\n잠시만 기다려주세요.');
        return;
      }

      toggleState(!onToggle);

      if (onToggle) return;
      else if (textReturnChecker().length < 1) return;

      onToggleSwitchFrom(buttonKey);
    };

    return (
      <DivToggleButton onClick={onClickToggle_TitleAPIFlow} $isActive={onToggle} $isBorder={isBorder}>
        <ImageIcon $marginBottom={'8px'} $width={'24px'} $height={'24px'} src={src} />
        <LabelToggleName> {buttonTitle} </LabelToggleName>
      </DivToggleButton>
    );
  };

  const setStateRoundButton = (buttonKey: ENUM_TOGGLE_BUTTON, isActive?: boolean) => {
    if (buttonKey === ENUM_TOGGLE_BUTTON.NONE) {
      setRoundButtonDropdown(false);
      setToggleRecommend(false);
      setToggleSummary(false);
      setToggleKeyword(false);

      setIsDraftRuleDetail(false);

      return;
    } else {
      if (isActive) {
        if (apiRequestCheck()) {
          setPopupText('AI 생성 및 검사 진행중입니다.\n잠시만 기다려주세요.');
          return;
        }
      } else {
        setSpinnerDropdown(false);
      }
    }

    setRoundButtonDropdown(buttonKey === ENUM_TOGGLE_BUTTON.DROPDOWN && isActive === true);

    if (isActive === true) onToggleSwitchFrom(buttonKey);
  };

  useEffect(() => {
    if (!scrollRef || apiCount < 1) return;

    setTimeout(async () => {
      window.scrollTo({
        behavior: 'smooth',
        top: scrollRef?.current?.offsetHeight,
      });
    }, 100);
  }, [apiCount]);

  useEffect(() => {
    setSpinnerDraft(onInnerSpinner ?? false);

    if (onInnerSpinner === true) setStateRoundButton(ENUM_TOGGLE_BUTTON.NONE);
  }, [onInnerSpinner]);
  return (
    <DivDisplay $isVisible={isVisible} $height="100%">
      <DivTopBlackBody>
        <ComponentToggleButton
          buttonKey={ENUM_TOGGLE_BUTTON.RECOMMEND}
          buttonTitle={'제목추천'}
          src={'/assets/Icon_Title_Recommend.png'}
          onToggle={onToggleRecommend}
          toggleState={setToggleRecommend}
          isBorder
        />
        <ComponentToggleButton
          buttonKey={ENUM_TOGGLE_BUTTON.SUMMARY}
          buttonTitle={'기사요약'}
          src={'/assets/Icon_Summary.png'}
          onToggle={onToggleSummary}
          toggleState={setToggleSummary}
        />
        <ComponentToggleButton
          buttonKey={ENUM_TOGGLE_BUTTON.KEYWORD}
          buttonTitle={'키워드추출'}
          src={'/assets/Icon_Keyword.png'}
          onToggle={onToggleKeyword}
          toggleState={setToggleKeyword}
        />
      </DivTopBlackBody>

      <DivContentsBody ref={scrollRef}>
        <ComponentUploadFileInformation
          isFileUploadType={uploadedFileSize > 0}
          titleText={fileName}
          textInput={originTextInput}
          isVisible
          uploadedFileSize={uploadedFileSize}
          isHiddenCloseButton
        />

        <DivDisplay $isVisible={onToggleRecommend}>
          <ComponentSpinnerInTheBox
            isVisible={onSpinnerTitle}
            title={'제목'}
            marginTop={ITEM_MARGIN_TOP_30PX}
            textareaMarginTop={'15px'}
            widthPadding={'50px'}
          />
          <ComponentLeftTitleRightButtonAndTextarea
            marginTop={ITEM_MARGIN_TOP_30PX}
            borderMargin={'14px'}
            hasSecondButton
            widthPadding={'50px'}
            isVisible={onSpinnerTitle === false}
            leftTitle={'제목'}
            textareaHeight={'22px'}
            textareaValue={recommendTitle}
            recreationButton={() => {
              setSpinnerTitle(true);
              onPostHookAPI_Title(seqID, 'T');
            }}
            companyInfo={companyInfo}
          />

          <ComponentLeftTitleRightButtonAndTextarea
            hasSecondButton
            isVisible={onSpinnerTitle === false}
            leftTitle={'부제목'}
            widthPadding={'50px'}
            textareaHeight={'88px'}
            subtitleText={recommendSubtitle}
            recreationButton={() => {
              setSpinnerTitle(true);
              onPostHookAPI_Title(seqID, 'S');
            }}
            companyInfo={companyInfo}
          />
        </DivDisplay>

        <ComponentSpinnerInTheBox
          isVisible={onSpinnerDraft}
          title={'기사 초안'}
          marginTop={ITEM_MARGIN_TOP_30PX}
          textareaMarginTop={'15px'}
          isTextareaWidthPadding
        />

        <ComponentLeftTitleRightButtonAndTextarea
          draggable
          rewrite
          marginTop={ITEM_MARGIN_TOP_30PX}
          needBottonInformation
          isVisible={onSpinnerDraft === false && isDraftRuleDetail === false}
          leftTitle={'기사 초안'}
          rightCopyButtonTitle={'본문 내용'}
          textareaHeight={'350px'}
          textareaValue={editedDraftText ?? originDraftText}
          notHalfWidthMinHeight={'260px'}
          //onCallback={() => {}}
          onCloseCallback={(pureString) => {
            setEditedDraftText(pureString);
          }}
          stateSetter={setEditedDraftTextEx}
          seqID={seqID}
          companyInfo={companyInfo}
        />

        <DivDisplay $isVisible={onToggleSummary}>
          <ComponentSpinnerInTheBox
            isVisible={onSpinnerSummary}
            title={'요약문'}
            marginTop={ITEM_MARGIN_TOP_30PX}
            textareaMarginTop={'15px'}
            widthPadding={'50px'}
          />
          <ComponentLeftTitleRightButtonAndTextarea
            isVisible={onSpinnerSummary === false}
            hasSecondButton
            leftTitle={'요약문'}
            widthPadding={'50px'}
            textareaHeight={'44px'}
            textareaValue={returnAPISummary ?? ''}
            recreationButton={() => {
              setSpinnerSummary(true);
              onPostHookAPI_Summary(seqID);
            }}
            companyInfo={companyInfo}
          />
        </DivDisplay>

        <DivDisplay $isVisible={onToggleKeyword}>
          <ComponentSpinnerInTheBox
            isVisible={onSpinnerKeyword}
            title={'핵심 키워드'}
            marginTop={ITEM_MARGIN_TOP_30PX}
            textareaMarginTop={'15px'}
            widthPadding={'50px'}
          />
          <ComponentLeftTitleRightButtonAndTextarea
            isVisible={onSpinnerKeyword === false}
            hasSecondButton
            leftTitle={'핵심 키워드'}
            widthPadding={'50px'}
            rightCopyButtonTitle={'키워드'}
            textareaHeight={'22px'}
            textArray={returnAPIArrayKeyword}
            recreationButton={() => {
              setSpinnerKeyword(true);
              onPostHookAPI_Keyword(seqID);
            }}
            companyInfo={companyInfo}
          />
        </DivDisplay>

        <DivBottomHeight $isVisible={roundButtonDropdown === false} />
      </DivContentsBody>

      <ComponentCommonPopup notificationText={popupText} onClick_Primary={() => setPopupText('')} />
    </DivDisplay>
  );
};

export default React.memo(PageDraftArticlesDetails);

const DivDisplay = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  width: 100%;
  height: ${(props) => props.$height};
`;

const DivBottomHeight = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  width: 100%;
  height: 26px;
`;

const DivLibraryFlex = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  justify-content: flex-end;
  width: 100%;
  margin-right: 20px;
`;

const DivSaveLibrary = styled.div`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  background-color: ${Readonly.Color.White_FFFFFF};
  font-size: 14px;
  color: ${Readonly.Color.DarkGray_333333};
  letter-spacing: 0.0145em;
  border-radius: 60px;
  cursor: pointer;
  width: 140px;
  height: 39px;
`;

const DivContentsBody = styled.div`
  display: flex;
  align-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 30px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-right: 52px;
  width: 100%;
  scrollbar-gutter: stable;
  height: 100%;
`;

const DivTopBlackBody = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  justify-content: flex-start;
  background-color: ${Readonly.Color.DarkGray_333333};
  width: 100%;
  height: 95px;
  border-radius: 10px;
`;

const ImageIcon = styled.img<CustomProperties>`
  width: ${(props) => props.$width ?? '17px'};
  height: ${(props) => props.$height ?? '17px'};
  object-fit: ${(props) => props.$content ?? 'contain'};
  margin-bottom: ${(props) => props.$marginBottom};
  margin-left: ${(props) => props.$marginLeft};
  cursor: pointer;
  ${(props) => (props.$isActive ? 'transform: rotate(-180deg)' : '')};
`;

const LabelToggleName = styled.label`
  ${Readonly.Style.Basic_White_Font};
  font-size: 13px;
  line-height: 24px;
  color: ${Readonly.Color.White_FFFFFF};
  cursor: pointer;
`;

const DivToggleButton = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  flex-direction: column;
  padding-left: 1%;
  padding-right: 1%;
  min-width: 65px;
  max-width: 95px;
  height: 95px;
  ${(props) => (props.$isActive ? 'background-image:' + Readonly.Color.Gradient_Point : '')};
  cursor: pointer;
  ${(props) => (props.$isBorder ? 'border-radius: 10px 0 0 10px' : '')};
`;

const DivRoundButton = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  width: fit-content;
  min-width: ${(props) => props.$minWidth};
  height: ${(props) => (props.$isActive ? '39px' : '37px')};
  white-space: nowrap;
  border-radius: 60px;
  border: ${(props) => (props.$isActive ? 'none' : 'solid 1px ' + Readonly.Color.White_FFFFFF)};
  margin-left: ${(props) => props.$marginLeft};
  padding-left: 1%;
  padding-right: 1%;
  cursor: pointer;
  ${Readonly.Style.Basic_White_Font};
  letter-spacing: 0.0145em;
  font-size: 14px;
  color: ${Readonly.Color.White_FFFFFF};
  ${(props) => (props.$isActive ? 'background-image:' + Readonly.Color.Gradient_Point : '')};
`;
