import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Route, Routes, useNavigate, useNavigationType } from 'react-router-dom';

import CustomProperties from 'Utility/CustomProperties';
import Readonly from 'Readonly/Readonly';
import { ComponentMenuButton } from 'Component/Component_MenuButton';
import { ComponentTutorialButton } from 'Component/Component_TutorialButton';
import { PageDraftArticles } from './PageDraftArticles';
import { PageInterview } from './PageInterview';
import { ComponentTwoButtonFooter } from 'Component/Component_TwoButtonFooter';
import { ComponentCommonPopup } from 'Component/Component_CommonPopup';

import { useApiActionStore, useDepthBackStore, useMenuSelectedStore, useModifyPageStore } from 'Store/MenuStore';
import { useInfo } from 'App';
import { debounce } from 'lodash';

export const enum ENUM_PAGE_INDEX {
  DRAFT_ARTICLES = 0,
  INTERVIEW,
}
const ARRAY_LEFT_MENU_TITLE = ['기사 초안 생성', '취재질의 생성'],
  RIGHT_BUTTON_NAME_DRAFT = '기사 재생성하기',
  LEFT_BUTTON_NAME_DRAFT = '새 기사 생성하기',
  RIGHT_BUTTON_NAME_INTERVIEW = '취재질의 재생성하기',
  LEFT_BUTTON_NAME_INTERVIEW = '새 질문 생성하기';

export interface Interface_SEO_Visible {
  isVisible: boolean;

  stateSetter: (value: React.SetStateAction<boolean>) => void;
  stateCaller?: (value: React.SetStateAction<number>) => void;
  onAPIState?: number;
  pageMover?: (value: React.SetStateAction<number>) => void;
  isHideMode?: boolean;
  companyInfo: useInfo;
  isEditStatus: boolean;
  setIsEditStatus: (value: React.SetStateAction<boolean>) => void;
}

export interface Interface_Navigation {
  pageName: ENUM_NAVIGATE;
  pageIndex: number;
}

const enum ENUM_NAVIGATION_TYPE {
  BACK = 'POP',
  NEXT = 'PUSH',
  REPLACE = 'REPLACE',
}

export const enum ENUM_NAVIGATE {
  DRAFT = '/draft',
  INTERVIEW = '/interview',
}
const NAVIGATION_INDEX_NAME_ARRAY = [ENUM_NAVIGATE.DRAFT, ENUM_NAVIGATE.INTERVIEW];
const LEFT_MENU_WIDTH_225_PX = 225;

export const PageMainFrame = ({
  companyInfo,
  initializeDraft,
  setInitializeDraft,
  initializeInterview,
  setInitializeInterview,

  isEditStatus,
  setIsEditStatus,
}: {
  companyInfo: useInfo;
  initializeDraft: boolean;
  setInitializeDraft: (value: React.SetStateAction<boolean>) => void;
  initializeInterview: boolean;
  setInitializeInterview: (value: React.SetStateAction<boolean>) => void;
  isEditStatus: boolean;
  setIsEditStatus: (value: React.SetStateAction<boolean>) => void;
}) => {
  const { apiActionPage, setApiActionPage, apiCallComplete, setApiCallComplete } = useApiActionStore();

  const [moveIndex, setMoveIndex] = useState(-1);

  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [location, setLocation] = useState({ ...window.location });
  const popStateSetter = () => setLocation({ ...window.location });

  const [movePopupText, setMovePopupText] = useState<string>('');
  const [moveRightButtonText, setMoveRightButtonText] = useState<string>('');

  useEffect(() => {
    if (apiCallComplete) {
      setApiCallComplete(false);
      if (isEditStatus && pageIndex !== apiActionPage) {
        setIsEditStatus(false);
        setApiActionPage(-1);
      }
    }
  }, [apiActionPage, isEditStatus, apiCallComplete]);

  const { setEditMode, setItemModify } = useModifyPageStore();

  const onClick_MoveNavigateTo = useCallback(
    (index: number) => {
      const loc = { ...window.location };

      if (isEditStatus) {
        setMoveRightButtonText('나가기');
        setMovePopupText('메뉴 이동 시 작성 중인 내용이 초기화됩니다.\n메뉴를 이동하시겠습니까?');
        setMoveIndex(index);
        return;
      }

      setPageIndex(index);

      if (loc.pathname.split('/').filter(Boolean).length > 1) {
        navigate(
          {
            pathname: NAVIGATION_INDEX_NAME_ARRAY[index],
          },
          { replace: true },
        );
      } else {
        navigate({
          pathname: NAVIGATION_INDEX_NAME_ARRAY[index],
        });
      }

      setLocation({ ...window.location });
      setIsEditStatus(false);
    },
    [isEditStatus],
  );

  const onOKPopupButtonFlowByIsEditStatus = useCallback(() => {
    setMovePopupText('');

    if (moveIndex === pageIndex) {
      setInitializeDraft(!initializeDraft);
      setInitializeInterview(!initializeInterview);
      setIsEditStatus(false);
      setEditMode(false);
      setItemModify(false);
    }

    setPageIndex(moveIndex);

    const pathName = NAVIGATION_INDEX_NAME_ARRAY[moveIndex];
    window.history.pushState({}, '', pathName);

    navigate({
      pathname: NAVIGATION_INDEX_NAME_ARRAY[moveIndex],
    });
    setMoveIndex(-1);
    setLocation({ ...window.location });
    setIsEditStatus(false);
  }, [moveIndex]);

  const { pageIndex, setPageIndex } = useMenuSelectedStore();
  const [popupText, setPopupText] = useState<string>('');
  const [rightButtonText, setRightButtonText] = useState<string>('');
  const [buttonInformation, setButtonInformation] = useState({
    isRight: false,
    count: 0,
  });

  const [apiTimingDraft, setAPITimingDraft] = useState<boolean>(false);
  const [callAPIDraft, setAPIDraft] = useState<number>(0);
  const [apiTimingInterview, setAPITimingInterview] = useState<boolean>(false);
  const [callAPIInterview, setAPIInterview] = useState<number>(0);

  const frameBodyRef = useRef<HTMLDivElement>(null);

  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [isHideMode, setHideMode] = useState<boolean>(window.innerWidth < Readonly.Value.Screen_Width_1300);
  const [isLeftFloatMenu, setLeftFloatMenu] = useState<boolean>(false);
  const [leftFloatValue, setLeftFloatValue] = useState<number>(0);

  const [onScroll, setScroll] = useState<boolean>(false);

  const onOKPopupButtonFlow = () => {
    setPopupText('');
    setMoveIndex(-1);
    setIsEditStatus(false);

    switch (pageIndex) {
      default:
        return;

      case ENUM_PAGE_INDEX.DRAFT_ARTICLES:
        buttonInformation.isRight ? setAPIDraft(callAPIDraft + 1) : setInitializeDraft(!initializeDraft);
        window.history.replaceState({}, '', '/draft');
        return;

      case ENUM_PAGE_INDEX.INTERVIEW:
        buttonInformation.isRight ? setAPIInterview(callAPIInterview + 1) : setInitializeInterview(!initializeInterview);
        window.history.replaceState({}, '', '/interview');
        return;
    }
  };

  useEffect(() => {
    if (apiTimingDraft === false && apiTimingInterview === false) return;

    let text = '작성한 내용이 초기화 처리됩니다.\n뒤로 이동하겠습니까?';

    switch (pageIndex) {
      default:
        text = '';

        break;

      case ENUM_PAGE_INDEX.DRAFT_ARTICLES:
        setRightButtonText(buttonInformation.isRight ? RIGHT_BUTTON_NAME_DRAFT : LEFT_BUTTON_NAME_DRAFT);

        break;

      case ENUM_PAGE_INDEX.INTERVIEW:
        setRightButtonText(buttonInformation.isRight ? RIGHT_BUTTON_NAME_INTERVIEW : LEFT_BUTTON_NAME_INTERVIEW);

        break;
    }

    setPopupText(text);
  }, [buttonInformation.count]);

  useEffect(() => {
    setLeftFloatValue(isLeftFloatMenu ? LEFT_MENU_WIDTH_225_PX : 0);
    setScroll(false);
  }, [isLeftFloatMenu]);

  useEffect(() => {
    if (!frameBodyRef || screenWidth < 100) return;

    setHideMode(screenWidth < Readonly.Value.Screen_Width_1300);
  }, [screenWidth, frameBodyRef]);

  const setFooterBottomPadding = () => {
    if (
      (ENUM_PAGE_INDEX.DRAFT_ARTICLES === pageIndex && apiTimingDraft) ||
      (ENUM_PAGE_INDEX.INTERVIEW === pageIndex && apiTimingInterview) ||
      (ENUM_PAGE_INDEX.DRAFT_ARTICLES === pageIndex && apiTimingDraft && onScroll && isHideMode)
    )
      return '150px';
    else return '0';
  };

  const listenerResize = debounce(() => {
    setScreenWidth(frameBodyRef.current?.offsetWidth ?? 0);
    setScroll(false);
  }, 100);

  const listenerScroll = () => {
    setScroll(true);
  };

  const onBlurEvent = (event: React.FocusEvent<HTMLDivElement>) => {
    setLeftFloatMenu(event.currentTarget.contains(event.relatedTarget));
  };

  useEffect(() => {
    listenerResize();
    window.addEventListener('scroll', listenerScroll, { capture: true });
    window.addEventListener('resize', listenerResize, { capture: true });
    window.addEventListener('popstate', popStateSetter, { capture: true });

    return () => {
      window.removeEventListener('scroll', listenerScroll, { capture: true });
      window.removeEventListener('resize', listenerResize, { capture: true });
      window.removeEventListener('popstate', popStateSetter, { capture: true });
    };
  }, []);

  const imgResize = true;
  return (
    <DivBody ref={frameBodyRef}>
      <DivPositionAbsolute $isVisible={isHideMode}>
        <DivLeftMenu>
          <ImageLogo src={`/assets/Logo_Title_Head.svg`} width={146} height={35} $marginTop={'80px'} $marginBottom={'60px'} />
          <DivLeftMenuMargin $width={'326px'}>
            {ARRAY_LEFT_MENU_TITLE.map((item, key) => (
              <ComponentMenuButton
                key={key}
                index={key}
                stateSetter={setPageIndex}
                title={item}
                active={key === pageIndex}
                onClickEvent={(index) => {
                  onClick_MoveNavigateTo(index);
                }}
              />
            ))}
          </DivLeftMenuMargin>

          <ComponentTutorialButton />

          <DivBottomAlignment>
            <ImageLogo src={'/assets/Logo_JCopilot.png'} width={106.3} height={90.5} />
            <LabelBottom> 본 서비스는 한국언론진흥재단의 지원을 받아 개발되었습니다. </LabelBottom>
          </DivBottomAlignment>
        </DivLeftMenu>
      </DivPositionAbsolute>

      <DivFlex $padding={isHideMode ? '0' : '326px'}>
        <DivRightContent id="divContent" $isBorder={apiTimingDraft || apiTimingInterview} $isActive={isHideMode} $marginBottom={setFooterBottomPadding()}>
          <Routes>
            <Route
              path={ENUM_NAVIGATE.DRAFT}
              element={
                <PageDraftArticles
                  key={initializeDraft ? 0 : 1}
                  isVisible={true}
                  stateSetter={setAPITimingDraft}
                  onAPIState={callAPIDraft}
                  isHideMode={isHideMode}
                  companyInfo={companyInfo}
                  isEditStatus={isEditStatus}
                  setIsEditStatus={setIsEditStatus}
                />
              }
            />

            <Route
              path={ENUM_NAVIGATE.INTERVIEW}
              element={
                <PageInterview
                  key={initializeInterview ? 2 : 3}
                  isVisible={true}
                  stateSetter={setAPITimingInterview}
                  onAPIState={callAPIInterview}
                  isHideMode={isHideMode}
                  companyInfo={companyInfo}
                  isEditStatus={isEditStatus}
                  setIsEditStatus={setIsEditStatus}
                />
              }
            />
          </Routes>
        </DivRightContent>

        <DivDisplay $isVisible={isHideMode}>
          <ComponentTwoButtonFooter
            isVisible={ENUM_PAGE_INDEX.DRAFT_ARTICLES === pageIndex && apiTimingDraft}
            leftButtonName={LEFT_BUTTON_NAME_DRAFT}
            rightButtonName={RIGHT_BUTTON_NAME_DRAFT}
            onClickCallback_LeftButton={() => {
              setButtonInformation({
                isRight: false,
                count: buttonInformation.count - 1,
              });
            }}
            onClickCallback_RightButton={() =>
              setButtonInformation({
                isRight: true,
                count: buttonInformation.count + 1,
              })
            }
            calcWidth={'326px'}
          />

          <ComponentTwoButtonFooter
            isVisible={ENUM_PAGE_INDEX.INTERVIEW === pageIndex && apiTimingInterview}
            leftButtonName={LEFT_BUTTON_NAME_INTERVIEW}
            rightButtonName={RIGHT_BUTTON_NAME_INTERVIEW}
            onClickCallback_LeftButton={() => {
              setButtonInformation({
                isRight: false,
                count: buttonInformation.count - 1,
              });
            }}
            onClickCallback_RightButton={() =>
              setButtonInformation({
                isRight: true,
                count: buttonInformation.count + 1,
              })
            }
            calcWidth={'326px'}
          />
        </DivDisplay>

        <ComponentTwoButtonFooter
          isHideMode={onScroll && isHideMode}
          isVisible={ENUM_PAGE_INDEX.DRAFT_ARTICLES === pageIndex && apiTimingDraft && onScroll && isHideMode}
          leftButtonName={LEFT_BUTTON_NAME_DRAFT}
          rightButtonName={RIGHT_BUTTON_NAME_DRAFT}
          onClickCallback_LeftButton={() =>
            setButtonInformation({
              isRight: false,
              count: buttonInformation.count - 1,
            })
          }
          onClickCallback_RightButton={() =>
            setButtonInformation({
              isRight: true,
              count: buttonInformation.count + 1,
            })
          }
          calcWidth={'0px'}
        />
      </DivFlex>

      <DivDisplay tabIndex={0} $isVisible={isHideMode === false} onBlur={onBlurEvent}>
        <DivHideModeButton onClick={() => setLeftFloatMenu(!isLeftFloatMenu)} $positionLeft={leftFloatValue}>
          <ImageLogo src={'/assets/Icon_LeftHideFloatMenu.png'} width={12} height={7} $content={isLeftFloatMenu ? 'transform: rotate(-180deg)' : ''} />
        </DivHideModeButton>

        <DivFloatLeftMenu $positionLeft={leftFloatValue - LEFT_MENU_WIDTH_225_PX}>
          <ImageLogo src={`/assets/Logo_Title_Head.svg`} width={146} height={35} $marginTop={'80px'} $marginBottom={'60px'} />

          <DivLeftMenuMargin $width={'100%'}>
            {ARRAY_LEFT_MENU_TITLE.map((item, key) => (
              <ComponentMenuButton
                key={key}
                index={key}
                stateSetter={setPageIndex}
                title={item}
                active={key === pageIndex}
                width={'190px'}
                fontSize={'16px'}
                marginLeft={'0'}
                isHideMode
                onClickEvent={(index) => {
                  onClick_MoveNavigateTo(index);
                }}
              />
            ))}
          </DivLeftMenuMargin>

          <ComponentTutorialButton isHideMode />

          <DivBottomAlignment>
            <ImageLogo src={'/assets/Logo_JCopilot.png'} width={73} height={62} />
            <LabelBottom $isActive>
              본 서비스는 한국언론진흥재단의
              <br />
              지원을 받아 개발되었습니다.
            </LabelBottom>
          </DivBottomAlignment>
        </DivFloatLeftMenu>
      </DivDisplay>

      <ComponentCommonPopup
        notificationText={popupText}
        OnClick_AnyOption={onOKPopupButtonFlow}
        rightButtonName={rightButtonText}
        onClick_Primary={() => {
          setPopupText('');
          setRightButtonText('');
        }}
      />

      <ComponentCommonPopup
        notificationText={movePopupText}
        OnClick_AnyOption={onOKPopupButtonFlowByIsEditStatus}
        rightButtonName={moveRightButtonText}
        onClick_Primary={() => {
          setMovePopupText('');
          setMoveRightButtonText('');
          setMoveIndex(-1);
        }}
      />
    </DivBody>
  );
};

const DivBody = styled.div`
  background-color: ${Readonly.Color.DarkGray_333333};
  display: flex;
  height: 100%;
  min-height: 100vh;
  width: 100vw;
`;

const DivHideModeButton = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  width: 32px;
  height: 48px;
  z-index: 1;
  top: 40px;
  left: ${(props) => props.$positionLeft}px;
  border-radius: 0 6px 6px 0;
  background-color: ${Readonly.Color.DarkGray_333333};
  position: fixed;
  cursor: pointer;
`;

const DivFlex = styled.div<CustomProperties>`
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-width: 1024px;
  padding-left: ${(props) => props.$padding};
`;

const DivDisplay = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'none' : '')};
`;

const ImageLogo = styled.img<CustomProperties>`
  margin-top: ${(props) => props.$marginTop};
  margin-left: ${(props) => props.$marginLeft};
  margin-bottom: ${(props) => props.$marginBottom};
  object-fit: contain;
  ${(props) => props.$content};
`;

const DivLeftMenuMargin = styled.div<CustomProperties>`
  width: ${(props) => props.$width};
  ${Readonly.Style.Display_Flex_Center};
  align-items: flex-end;
  flex-direction: column;

  ${(props) => props.$content};
`;

const DivPositionAbsolute = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'none' : 'flex')};
  z-index: 2;
  position: fixed;
  background-color: ${Readonly.Color.DarkGray_333333};
  height: 100vh;
`;

const DivLeftMenu = styled.div<CustomProperties>`
  display: inline-flex;
  width: 326px;
  border-radius: 0 1px 0 0;
  flex-direction: column;
  align-items: center;
`;

const DivFloatLeftMenu = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  flex-direction: column;
  justify-content: flex-start;
  width: ${LEFT_MENU_WIDTH_225_PX}px;
  height: 100vh;
  background-color: ${Readonly.Color.DarkGray_333333};
  z-index: 99;
  position: fixed;
  left: ${(props) => props.$positionLeft}px;
  top: 0;
`;

const DivRightContent = styled.div<CustomProperties>`
  min-height: calc(100% - 294px);
  display: grid;
  padding: ${(props) => (props.$isBorder ? '70px 70px 0 70px' : '70px')};
  background-color: ${Readonly.Color.White_FFFFFF};
  border-radius: ${(props) => (props.$isBorder ? '30px 0 0 0' : '30px 0 0 30px')};
  border-radius: ${(props) => (props.$isActive ? 0 : '')};
  height: 100%;
  padding-bottom: ${(props) => props.$marginBottom};
`;

const LabelBottom = styled.label<CustomProperties>`
  ${Readonly.Style.Basic_White_Font};
  ${Readonly.Style.Display_Flex_Center};
  font-size: ${(props) => (props.$isActive ? '13px' : '15px')};
  font-weight: 500;
  color: ${Readonly.Color.Support_DCDCDC};
  margin-top: 40px;
  padding: ${(props) => (props.$isActive ? '0 27px 0 27px' : '0 65px 0 65px')};
  text-align: center;
  margin-bottom: 79px;
`;

const DivBottomAlignment = styled.div`
  display: flex;

  bottom: 0px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  margin-top: auto;
`;
