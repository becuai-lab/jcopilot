import styled from 'styled-components';
import { useEffect, useState } from 'react';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';
import { SizeConverter } from 'Utility/SizeConverter';

interface Interface_BlueColorLabel {
  isVisible: boolean;
  titleText: string;
  textInput: string;
  isFileUploadType: boolean;

  uploadedFileSize?: number;
  isHiddenCloseButton?: boolean;
  onInitializer?: () => void;
  isItemDownload?: () => void;
}

const TITLE_TEXT_MAXIMUM_LENGTH_64 = 64;

export const ComponentUploadFileInformation = ({
  isVisible,
  titleText,
  textInput,
  uploadedFileSize,
  isHiddenCloseButton,
  isFileUploadType,
  onInitializer,
  isItemDownload,
}: Interface_BlueColorLabel) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [shortTitleText, setShortTitleText] = useState<string>('');

  useEffect(() => {
    if (textInput?.length < 100) return;

    setShortTitleText(textInput.length > TITLE_TEXT_MAXIMUM_LENGTH_64 ? textInput.substring(TITLE_TEXT_MAXIMUM_LENGTH_64, -1) : textInput);
  }, [textInput]);

  return (
    <DivDisplay $isVisible={isVisible}>
      <DivUploadedNotificationBox $isVisible={isFileUploadType} $content={isHiddenCloseButton ? '' : 'margin-left : 40px; margin-right : 40px'}>
        <IconImage $size={'40px'} src={'/assets/Icon_File_Uploaded.png'} />

        <DivFileInformation $height={'84px'}>
          <LabelTitle $fontSize={'16px'}> {titleText} </LabelTitle>
          <LabelSubTitle $isVisible $marginTop={'4px'} $fontSize={'15px'}>
            {SizeConverter(uploadedFileSize)}
          </LabelSubTitle>
        </DivFileInformation>

        <IconImage
          onClick={onInitializer && onInitializer}
          $display={isHiddenCloseButton ? 'none' : ''}
          $size={'20px'}
          src={'/assets/Icon_Close_Button.png'}
          $marginLeft={'auto'}
          $marginRight={'30px'}
          $content={'cursor : pointer'}
        />

        <IconImage
          onClick={isItemDownload && isItemDownload}
          $display={isItemDownload === undefined ? 'none' : ''}
          $size={'24px'}
          src={'/assets/Icon_MyLibrary_ItemDownload.png'}
          $marginLeft={'auto'}
          $marginRight={'30px'}
          $content={'cursor : pointer'}
        />
      </DivUploadedNotificationBox>

      <DivUploadedNotificationBox $isVisible={isFileUploadType === false} onClick={() => setOpen(!isOpen)}>
        <IconImage $size={'40px'} src={'/assets/Icon_TextInput.png'} />

        {isOpen ? (
          <DivFileInformation $height={'fit-content'} $content={'margin-right : 23px'}>
            <LabelTitle $marginTop={'24px'} $marginBottom={'24px'} $fontSize={'16px'} $content={'white-space: break-spaces'}>
              {textInput}
            </LabelTitle>
          </DivFileInformation>
        ) : (
          <DivFileInformation $height={'65px'} $content={'margin-right : 23px'}>
            <LabelTitle $marginTop={'24px'} $marginBottom={'24px'} $fontSize={'16px'}>
              {shortTitleText}
            </LabelTitle>
          </DivFileInformation>
        )}

        <IconImage
          $isReverse={isOpen}
          onClick={() => setOpen(!isOpen)}
          $display={'display'}
          $size={'20px'}
          src={'/assets/Icon_TextInput_Folder.png'}
          $marginLeft={'auto'}
          $marginRight={'30px'}
          $content={'cursor : pointer'}
        />
      </DivUploadedNotificationBox>
    </DivDisplay>
  );
};

const DivDisplay = styled.div<CustomProperties>`
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  width: 100%;
  height: fit-content;
  overflow: visible;
`;

const DivUploadedNotificationBox = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  display: ${(props) => (props.$isVisible ? '' : 'none')};
  justify-content: flex-start;
  border-radius: 6px;
  border: solid 1px ${Readonly.Color.Box_EOE5EF};
  box-shadow: 0 3px 3px 0 ${Readonly.Color.Box_Shadow};
  padding-left: 22px;
  ${(props) => props.$content};

  overflow: overlay;
  text-overflow: ellipsis;

  scrollbar-gutter: stable;
`;

const IconImage = styled.img<CustomProperties>`
  display: ${(props) => props.$display};
  width: ${(props) => props.$size};
  height: ${(props) => props.$size};
  margin-left: ${(props) => props.$marginLeft};
  margin-right: ${(props) => props.$marginRight};
  ${(props) => props.$content};
  ${(props) => (props.$isReverse ? 'transform : rotate(-180deg)' : '')};
`;

const DivFileInformation = styled.div<CustomProperties>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 12px;
  height: ${(props) => props.$height};
  ${(props) => props.$content};
`;

const LabelTitle = styled.label<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: ${(props) => props.$fontSize ?? '22px'};
  margin-top: ${(props) => props.$marginTop};
  margin-bottom: ${(props) => props.$marginBottom};
  color: ${Readonly.Color.Black_Zero};
  justify-content: ${(props) => props.$marginLeft};
  line-height: 24px;
  ${(props) => props.$content};
`;

const LabelSubTitle = styled.label<CustomProperties>`
  margin-top: ${(props) => props.$marginTop};
  ${Readonly.Style.Basic_White_Font};
  font-size: ${(props) => props.$fontSize ?? '13px'};
  font-weight: 500;
  color: ${Readonly.Color.Gray_777777};
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  height: 18px;
`;
