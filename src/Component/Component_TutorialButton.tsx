import styled from 'styled-components';
import { useState } from 'react';

import Readonly from 'Readonly/Readonly';
import CustomProperties from 'Utility/CustomProperties';

interface Interface_Tutorial {
  isHideMode?: boolean;
}

export const ComponentTutorialButton = ({ isHideMode }: Interface_Tutorial) => {
  const [isVisible, setVisible] = useState(false);

  return (
    <DivCenter $width={isHideMode ? 'auto' : '326px'} $isActive={isHideMode}>
      <DivTutorialButton $width={isHideMode ? '185px' : '259px'} $isActive={isHideMode} onClick={() => setVisible(true)}>
        튜토리얼 보기
      </DivTutorialButton>

      <DivModal $isVisible={isVisible} onClick={() => setVisible(false)}>
        <DivTutorialArea>
          <DivTutorialBody>
            <DivTutorialTitle>
              <p className="div">
                <span className="text-wrapper">기사 작성을 위한 </span>
                <span className="span">최적화된 솔루션</span>
              </p>
            </DivTutorialTitle>

            <List01ParentRoot>
              <List>
                <Text>
                  <Gpt4oomniContainer>
                    <Gpt4oomni>
                      <Gpt>GPT-4</Gpt>
                      <Oomni>o(Omni)</Oomni>
                      <Span>와 함께하는</Span>
                    </Gpt4oomni>
                    <Gpt4oomni>가장 빠른 기사생성</Gpt4oomni>
                  </Gpt4oomniContainer>
                  <AiContainer>
                    <Gpt4oomni>바쁜 업무 속 보도자료만 넣으면,</Gpt4oomni>
                    <Ai>최소한의 수정이 가능한 형태로 AI가 초안을 작성합니다.</Ai>
                    <Gpt4oomni>다양한 AI 기능을 활용해 더 완벽한 결과물을 생성해 보세요.</Gpt4oomni>
                  </AiContainer>
                </Text>
                <Icon alt="" src="/assets/tutorial_1.svg" />
                <List01Child />
              </List>
              <List>
                <Text1>
                  <Gpt4oomniContainer>
                    <Gpt4oomni>
                      <Oomni>{`국내 `}</Oomni>
                      <Span>언론사에 최적화된</Span>
                    </Gpt4oomni>
                    <Gpt4oomni>기사생성 방식</Gpt4oomni>
                  </Gpt4oomniContainer>
                  <AiContainer>
                    <Gpt4oomni>일반적인 문장생성이 아닌, 국내 언론사들의</Gpt4oomni>
                    <Gpt4oomni>기사작성 지침에 맞는 문장구조와 표현을 사용하여 기사를 생성합니다.</Gpt4oomni>
                    <Gpt4oomni>한글(HWP/HWPX)파일과, PDF파일 첨부를 지원합니다.</Gpt4oomni>
                  </AiContainer>
                </Text1>
                <Icon1 alt="" src="/assets/tutorial_2.svg" />
                <List01Child />
              </List>
              <List1>
                <Text2>
                  <Gpt4oomniContainer>
                    <Span>{`업무에 필요한 `}</Span>
                    <Gpt>부가기능</Gpt>
                    <Span> 제공</Span>
                  </Gpt4oomniContainer>
                  <Div>
                    <Gpt4oomni>취재 전 다양한 어조의 취재질의를 다양하게 생성할 수 있습니다.</Gpt4oomni>
                    <Gpt4oomni>기사생성 외 본문요약, 키워드 추출 등 다양한 부가기능을 지원합니다.</Gpt4oomni>
                  </Div>
                </Text2>
                <Icon2 alt="" src="/assets/tutorial_3.svg" />
                <List03Child />
              </List1>
            </List01ParentRoot>
          </DivTutorialBody>
        </DivTutorialArea>

        <DivCornerPosition>
          <ImageObject src="/assets/Icon_Close_Button.svg" />
        </DivCornerPosition>
      </DivModal>
    </DivCenter>
  );
};

const DivCenter = styled.div<CustomProperties>`
  width: ${(props) => props.$width};
  z-index: 999;
  padding: ${(props) => (props.$isActive ? ' 65px 32px 0' : '0')};

  ${(props) => props.$content};
`;

const DivTutorialButton = styled.div<CustomProperties>`
  width: ${(props) => props.$width};
  height: 50px;
  border-radius: 6px;
  border: solid 1px #777777;
  cursor: pointer;
  ${Readonly.Style.Display_Flex_Center};
  ${Readonly.Style.Basic_White_Font};
  font-size: 15px;
  margin-top: ${(props) => (props.$isActive ? '53px' : '65px')};
  margin-left: ${(props) => (props.$isActive ? '0' : '32px')};
`;

const DivModal = styled.div<CustomProperties>`
  ${Readonly.Style.Display_Flex_Center};
  display: ${(props) => (props.$isVisible ? 'block' : 'none')};
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
  z-index: 999;
  background-color: ${Readonly.Color.WaitingButton_DCDFEA};
`;

const DivTutorialArea = styled.div`
  margin: 0;

  display: block;
  height: 100vh;
  overflow: scroll;
  overflow-x: hidden;
`;

const DivTutorialBody = styled.div`
  display: block;
  margin: auto;
  padding: 123px 0 141px;
  width: 703px;
  max-width: calc(100vw - 60px);
`;

const DivTutorialTitle = styled.div`
  display: block;
  min-height: 48px;
  min-width: 502px;
  margin: 0;
  padding: 0;

  p {
    text-align: center;
    color: transparent;
    font-size: 40px;
    font-weight: 700;
    letter-spacing: -1.13px;
    line-height: normal;
    white-space: nowrap;
    margin: 40px 0 0;
  }

  span.text-wrapper {
    color: #000000;
    letter-spacing: -0.45px;
  }
  span.span {
    color: #1f68f6;
    letter-spacing: -0.45px;
  }
`;

const DivCornerPosition = styled.div`
  width: 46px;
  height: 46px;
  padding: 0;
  position: absolute;
  top: 30px;
  right: 30px;
`;

const ImageObject = styled.img<CustomProperties>`
  object-fit: contain;
`;

const Gpt = styled.span`
  color: #000;
`;
const Oomni = styled.span`
  color: #1f68f6;
`;
const Span = styled.span``;
const Gpt4oomni = styled.p`
  margin: 0;
`;
const Gpt4oomniContainer = styled.b`
  position: absolute;
  top: 0px;
  left: 0px;
  letter-spacing: -0.02em;
  line-height: 30px;
`;
const Ai = styled.p`
  margin: 0;
  white-space: pre-wrap;
`;
const AiContainer = styled.div`
  position: absolute;
  top: 74px;
  left: 0px;
  font-size: 15px;
  letter-spacing: -0.01em;
  line-height: 22px;
  font-weight: 500;
  color: #333;
`;
const Text = styled.div`
  position: absolute;
  top: 45px;
  left: 236.5px;
  width: 343px;
  height: 140px;
`;
const Icon = styled.img`
  position: absolute;
  top: 63.45px;
  left: 30px;
  width: 146px;
  height: 103.1px;
  overflow: hidden;
`;
const List01Child = styled.div`
  position: absolute;
  top: calc(50% - 68px);
  left: 192.61px;
  background-color: #e3e6f0;
  width: 1px;
  height: 136px;
`;
const List = styled.div`
  align-self: stretch;
  position: relative;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #dbe4ec;
  box-sizing: border-box;
  height: 240px;
  overflow: hidden;
  flex-shrink: 0;
`;
const Text1 = styled.div`
  position: absolute;
  top: 45px;
  left: 236.5px;
  width: 403px;
  height: 140px;
`;
const Icon1 = styled.img`
  position: absolute;
  top: 63.5px;
  left: 30px;
  width: 146px;
  height: 103px;
  overflow: hidden;
`;
const Div = styled.div`
  position: absolute;
  top: 44px;
  left: 0px;
  font-size: 15px;
  letter-spacing: -0.01em;
  line-height: 22px;
  font-weight: 500;
  color: #333;
`;
const Text2 = styled.div`
  position: absolute;
  top: 60.5px;
  left: 236.5px;
  width: 397px;
  height: 110px;
`;
const Icon2 = styled.img`
  position: absolute;
  top: 63.88px;
  left: 30px;
  width: 146px;
  height: 103.2px;
  overflow: hidden;
`;
const List03Child = styled.div`
  position: absolute;
  top: calc(50% - 67.5px);
  left: 192.61px;
  background-color: #e3e6f0;
  width: 1px;
  height: 136px;
`;
const List1 = styled.div`
  align-self: stretch;
  position: relative;
  border-radius: 6px;
  background-color: #fff;
  border: 1px solid #dbe4ec;
  box-sizing: border-box;
  height: 240px;
  overflow: hidden;
  flex-shrink: 0;
  color: #1f68f6;
`;
const List01ParentRoot = styled.div`
  width: 100%;
  position: relative;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 14px;
  text-align: left;
  font-size: 22px;
  color: #000;
`;
