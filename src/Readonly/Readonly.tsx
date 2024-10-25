const Color = {
  Gradient_Point: 'linear-gradient(to right, #1F82F6 , #8A1FF6);',
  Blue_1F68F6: '#1f68f6',
  Dashed_C8CFE8: '#c8cfe8',

  Black_Zero: '#000000',
  DarkGray_333333: '#333333',
  Gray_777777: '#777777',
  Gray_999999: '#999999',
  Gray_E3E6F0: '#E3E6F0',
  Box_EOE5EF: '#E0E5EF',
  Box_FCFDFF: '#fcfdff',
  Box_Shadow: '#eff0f6',
  NonActive_DFDFDF: '#dfdfdf',
  TextCount_BFBFBF: '#bfbfbf',
  Support_DCDCDC: '#dcdcdc',
  PageText_ADADAD: '#adadad',
  WaitingButton_DCDFEA: '#DCDFEA',
  White_FFFFFF: '#ffffff',
  Border_DEDEDE: '#dedede',
  Footer_E4E4E4: '#E4E4E4',
  InterviewLine_C2D5F4: '#C2D5F4',
  MyLibraryWidthLine_E7E7E7: '#E7E7E7',
};

const Value = {
  Screen_Width_1300: 1300,
  InputLength_Minimum_30: 30,
  InputLength_Minimum_100: 99,
  InputLength_Middle_200: 200,
  InputLength_Middle_300: 300,
  InputLength_Maximum_4000: 4000,

  MagicKey_alternative_undefined_number: -999,

  Array_ButtonName: ['파일 첨부하기', '텍스트로 입력'],
};

const Style = {
  Basic_White_Font: `
        font-style: normal;
        font-size : 18px;
        font-weight: 700;
        letter-spacing: -0.0057em;
        color: ${Color.White_FFFFFF};
    `,
  Gray_Notice_Font_17: `
        font-size : 17px;
        font-weight : 500;
        letter-spacing: -0.0057em;
        color: ${Color.Gray_777777};
    `,

  Gray_Notice_Font: `
        font-size : 15px;
        font-weight : 500;
        letter-spacing: -0.0057em;
        color: ${Color.Gray_777777};
    `,

  Display_Flex_Center: `
        display: flex;
        align-items: center;
        justify-content: center;
    `,
};

const HTTP_CODE = {
  OK_PASS_0000: '0000',
  OK_PASS_200: 200,

  BAD_REQUEST_400: 400,
};

const Readonly = {
  Style,
  Color,
  Value,
  HTTP_CODE,
};

export default Readonly;

export const enum ENUM_BUTTON_ACTIVE_INDEX {
  FILE_UPLOAD_ACTIVE = 0,
  TEXT_INPUT_ACTIVE = 1,
}

export const enum ENUM_API_INPUT_TYPE {
  NONE = -1,

  FILE_UPLOAD_1 = 1,
  TEXT_INPUT_2 = 2,
}
