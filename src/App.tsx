import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { PageMainFrame } from 'Page/PageMainFrame';
import { GlobalStyles } from 'Utility/GlobalStyles';
import { useDepthBackStore, useMenuSelectedStore, useModifyPageStore } from 'Store/MenuStore';
import { ComponentCommonPopup } from 'Component/Component_CommonPopup';

export interface useInfo {
  username?: string;
  email?: string;
  department?: string;
}

const enum ENUM_NAVIGATE {
  DRAFT = '/draft',
  INTERVIEW = '/interview',
}
const NAVIGATION_INDEX_NAME_ARRAY = [ENUM_NAVIGATE.DRAFT, ENUM_NAVIGATE.INTERVIEW];

export const App = () => {
  const { setPageIndex, pageIndex } = useMenuSelectedStore();

  const [initializeDraft, setInitializeDraft] = useState<boolean>(false);
  const [initializeInterview, setInitializeInterview] = useState<boolean>(false);

  const location = window.location;

  const [companyInfo, setCompanyInfo] = useState<useInfo>({
    username: '',
    email: '',
    department: '',
  });

  const navigate = useNavigate();

  const [isEditStatus, setIsEditStatus] = useState(false);
  const [popupText, setPopupText] = useState<string>('');
  const [rightButtonText, setRightButtonText] = useState<string>('');

  const [movePopupText, setMovePopupText] = useState<string>('');
  const [moveRightButtonText, setMoveRightButtonText] = useState<string>('');

  useEffect(() => {
    if (location.pathname === '/') {
      setPageIndex(0);
      navigate('/draft');
      return;
    }

    if (location.pathname.split('/').length > 2) {
      const firstPath = location.pathname.split('/', 2).join('/');
      navigate(firstPath);
      return;
    }

    const list = [...NAVIGATION_INDEX_NAME_ARRAY] as string[];
    const index = list.indexOf(location.pathname);
    const indexReal = Math.max(0, index < 0 ? pageIndex : index);

    if (index != indexReal) {
      setPageIndex(indexReal);
      navigate(NAVIGATION_INDEX_NAME_ARRAY[indexReal]);
    }
  }, []);

  const onOKPopupButtonFlowByIsEditStatus = useCallback(() => {
    setMovePopupText('');

    setInitializeDraft(!initializeDraft);
    setInitializeInterview(!initializeInterview);
    setIsEditStatus(false);
    setEditMode(false);
    setItemModify(false);

    const pathName = NAVIGATION_INDEX_NAME_ARRAY[pageIndex];
    window.history.pushState({}, '', pathName);

    navigate({
      pathname: NAVIGATION_INDEX_NAME_ARRAY[pageIndex],
    });

    setIsEditStatus(false);
  }, [pageIndex]);

  const { isItemModify, setItemModify, isEdidMode, setEditMode } = useModifyPageStore();

  const { setDepthBack } = useDepthBackStore();
  const locationRouter = useLocation();

  const backEvent = useCallback(() => {
    if (isEditStatus) {
      window.history.pushState({}, '', locationRouter.pathname);
      setMoveRightButtonText('나가기');
      setMovePopupText('메뉴 이동 시 작성 중인 내용이 초기화됩니다.\n메뉴를 이동하시겠습니까?');
    } else {
      if (location.pathname === '/draft') {
        setPageIndex(0);
        setDepthBack(true);
      } else if (location.pathname === '/interview') {
        setPageIndex(1);
        setDepthBack(true);
      } else {
        window.history.back();
      }
    }
  }, [isEditStatus]);

  useEffect(() => {
    if (isEditStatus) {
      if (!window.location.href.includes('modify')) {
        window.history.pushState({}, '', locationRouter.pathname);
      }
    }

    window.addEventListener('popstate', backEvent);
    return () => window.removeEventListener('popstate', backEvent);
  }, [isEditStatus]);

  if (pageIndex < 0) {
    return <></>;
  }

  return (
    <>
      <DivAppBody>
        <GlobalStyles />
        <Routes>
          <Route
            index
            path={'*'}
            element={
              <PageMainFrame
                companyInfo={companyInfo}
                initializeDraft={initializeDraft}
                setInitializeDraft={setInitializeDraft}
                initializeInterview={initializeInterview}
                setInitializeInterview={setInitializeInterview}
                isEditStatus={isEditStatus}
                setIsEditStatus={setIsEditStatus}
              />
            }
          />
        </Routes>

        <ComponentCommonPopup
          notificationText={popupText}
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
            window.history.pushState({}, '', `${window.location.href}/modify`);
          }}
        />
      </DivAppBody>
    </>
  );
};

const DivAppBody = styled.div`
  width: 100vw;
  height: auto;
`;
