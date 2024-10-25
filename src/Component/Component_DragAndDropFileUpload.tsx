import styled from 'styled-components';
import { useState } from 'react';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { ComponentBlueColorLabel } from './Component_BlueColorLabel';
import { ComponentWaitingSpinner } from './Component_WaitingForGenerator';
import { ComponentUploadFileInformation } from './Component_UploadFileInformation';
import { ComponentCommonPopup } from './Component_CommonPopup';

interface Interface_DragAndDropFileUpload {
  stateSetterFile: (value: React.SetStateAction<File | null | undefined>) => void;
  stateSetterName: (value: React.SetStateAction<string>) => void;

  calcBoxHeight: string;
  leftText: string;
  rightText: string;
  middleBlueText: string;
  isGenerating: boolean;
  waitingNotificationText: string;
  uploadedFileSize: number;
  fileName: string;

  marginTop?: string;
}

const ARRAY_ALLOW_FILE_EXTENSION = ['pdf', 'hwp', 'hwpx', 'text', 'application/pdf', 'application/haansofthwpx', 'application/haansofthwp', 'text/plain'];

export const ComponentDragAndDropFileUpload = ({
  stateSetterFile,
  stateSetterName,
  calcBoxHeight,
  isGenerating,
  waitingNotificationText,
  uploadedFileSize,
  leftText,
  middleBlueText,
  rightText,
  fileName,
  marginTop,
}: Interface_DragAndDropFileUpload) => {
  const [popupText, setPopupText] = useState<string>('');

  const onChange_DragAndDrop = async (event: React.FormEvent<HTMLInputElement>) => {
    try {
      const target = event.target as HTMLInputElement & { files: FileList };

      let file = target?.files[0] ?? undefined;
      target.value = '';

      if (!file) {
        const windowModeFile = event.currentTarget?.files ?? undefined;

        if (windowModeFile && windowModeFile?.item?.length > 1) file = windowModeFile.item(0) as File;
        else {
          setPopupText('첨부된 파일이 없습니다.');

          return;
        }
      }

      if (!file || file.size > 512000000) {
        setPopupText('입력 가능 크기를 초과하였습니다.');

        return;
      }

      let i,
        allowCount = 0;
      for (i = 0; i < ARRAY_ALLOW_FILE_EXTENSION.length; ++i) {
        if (file.type?.length > 1 && file.type === ARRAY_ALLOW_FILE_EXTENSION[i]) {
          ++allowCount;
        }
      }

      setPopupText('');
      stateSetterName('');

      if (allowCount === 1) {
        stateSetterFile(file);
        stateSetterName(file.name);
      } else if (file?.type?.length < 1) {
        const nameArray = file.name.split('.');

        const fileTypeFromName = nameArray[nameArray.length - 1] ?? '';

        if (fileTypeFromName?.length > 1 && ARRAY_ALLOW_FILE_EXTENSION.includes(fileTypeFromName)) {
          const newFile = new File([file], file.name, {
            type: fileTypeFromName,
          });

          stateSetterFile(newFile);
          stateSetterName(newFile.name);
        } else setPopupText('올바른 파일 형식이 아닙니다.');
      } else setPopupText('올바른 파일 형식이 아닙니다.');
    } catch (exception) {
      setPopupText((exception as { message: string }).message);
    }
  };

  const initializer = () => {
    stateSetterFile(null);
    stateSetterName('');
  };

  return (
    <>
      <DivDisplay $isVisible={fileName.length === 0}>
        <DivDashedBox $height={'calc(100vh - ' + calcBoxHeight + ')'} $marginTop={marginTop ?? '16px'}>
          <InputFileUpload $height={'calc(100vh - ' + calcBoxHeight + ')'} type={'file'} onChange={onChange_DragAndDrop} />
          <IconImage src={'/assets/Icon_Interview_Information.png'} />

          <LabelTitle $fontSize={'20px'} $marginTop={'20px'} $marginBottom={'16px'}>
            {leftText + '\u00A0'}
            <ComponentBlueColorLabel text={middleBlueText} fontSize={'20px'} />
            {rightText}
          </LabelTitle>

          <LabelSubNotice>입력 가능 형식 : pdf, hwp, hwpx, txt </LabelSubNotice>
          <LabelSubNotice>파일을 직접 끌어오거나, 클릭해서 업로드하세요.</LabelSubNotice>
          <LabelSubNotice> (파일은 1개만 첨부 가능합니다.) </LabelSubNotice>
        </DivDashedBox>
      </DivDisplay>

      <DivDisplay $isVisible={fileName.length > 0}>
        <DivDashedBox $height={'calc(100vh - ' + calcBoxHeight + ')'} $marginTop={marginTop ?? '16px'}>
          <ComponentUploadFileInformation
            isFileUploadType
            titleText={fileName}
            textInput={''}
            isVisible={isGenerating === false}
            uploadedFileSize={uploadedFileSize}
            onInitializer={initializer}
          />

          <ComponentWaitingSpinner isVisible={isGenerating} topText={waitingNotificationText} />
        </DivDashedBox>
      </DivDisplay>

      <ComponentCommonPopup notificationText={popupText} onClick_Primary={() => setPopupText('')} />
    </>
  );
};

const DivDisplay = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
`;

const DivDashedBox = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  flex-direction: column;
  border: dashed 2px ${Readonly.Color.Dashed_C8CFE8};
  background-color: ${Readonly.Color.Box_FCFDFF};
  border-radius: 6px;
  margin-top: ${(props) => props.$marginTop};
  height: ${(props) => props.$height};
  min-height: 210px;
  padding-top: 40px;
  padding-bottom: 40px;
`;

const LabelSubNotice = styled.label`
  ${Readonly.Style.Gray_Notice_Font_17};
  margin-top: 4px;
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

const IconImage = styled.img<CustomProperties>`
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
`;

const InputFileUpload = styled.input<CustomProperties>`
  cursor: pointer;
  position: absolute;
  min-height: 210px;

  min-width: 880px;
  opacity: 0.001;
  z-index: 1;
  width: 75%;
  height: ${(props) => props.$height};
`;
