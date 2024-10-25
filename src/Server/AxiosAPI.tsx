/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */

import { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';

import { AxiosInstance, AxiosInstanceDelete, AxiosInstanceFileDownload, AxiosInstanceNotBaseURL } from './AxiosInstance';
import Readonly from 'Readonly/Readonly';
import API_URL from './API_URL';
import { useInfo } from 'App';

const CONFIG_HEADER_FORMDATA = {
  headers: { 'content-type': 'multipart/form-data' },
};
const CONFIG_HEADER_JSON = { headers: { 'content-type': 'application/json' } };

interface Interface_Basic {
  code: string;
  msg: string;
}
interface Interface_DraftArticleText {
  article_text: string;

  seq_id?: number;
  model_name?: string;
}

const getBinaryBlobFrom = async (file: File | null) => {
  if (!file || file === null) {
    alert('file is null');
    return null;
  }

  const bufferArray = new Uint8Array((await fileReaderForArrayBuffer(file)) as ArrayBuffer).buffer;
  const binaryBlob = new Blob([bufferArray], { type: file.type });

  return binaryBlob;
};

const fileReaderForArrayBuffer = async (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', (error) => reject(error));

    return reader.readAsArrayBuffer(file);
  });
};

const errorAlert = (message: string, code: number | string) => {
  alert('[ERROR code(' + code + ')] message : ' + message);
};

interface Interface_Response_OneResult extends Interface_Basic {
  result: {
    result_data: string;

    completion_tokens?: number;
    prompt_tokens?: number;
    seq_id?: number;
    total_tokens?: number;
  };
}
interface Interface_DraftArticles {
  input_type_1or2: number;
  input_text: string;
  uploaded_file: File | null;

  model_name?: string;
}

export const PostHook_CreationDraftArticles = (
  url: string,
  { input_text, input_type_1or2, uploaded_file, model_name }: Interface_DraftArticles,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
  apiCallbackFailFunction?: () => void,
) => {
  const [returnAPIData, setReturnAPIData] = useState<string>('');
  const [returnSeqID, setSeqID] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const onPostHookAPI_BinaryBlob = async (is_retry?: boolean) => {
    const binaryBlob = await getBinaryBlobFrom(uploaded_file);

    if (input_type_1or2 < 1)
      throw Object.assign(new Error(), {
        code: Readonly.HTTP_CODE.BAD_REQUEST_400,
        message: 'check input type for API : ' + input_type_1or2,
      });
    else if (!binaryBlob || binaryBlob?.size === 0)
      throw Object.assign(new Error(), {
        code: Readonly.HTTP_CODE.BAD_REQUEST_400,
        message: 'binaryBlob is undefinded or size zero.',
      });

    const formData = new FormData();

    formData.append('input_text', input_text);
    formData.append('input_type', input_type_1or2 as any);
    formData.append('uploaded_file', binaryBlob);
    formData.append('is_retry', is_retry ?? (false as any));
    formData.append('model_name', model_name ?? '');
    formData.append('file_name', uploaded_file?.name ?? '없을리가_없음');

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticles>>(url, formData, CONFIG_HEADER_FORMDATA)
      .then((response: AxiosResponse) => {
        const responseData: Interface_Response_OneResult = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          setReturnAPIData(responseData.result?.result_data);
          setSeqID(responseData.result?.seq_id ?? 0);

          if (callbackFunction) callbackFunction();
        } else {
          setPopupText(responseData.msg);

          if (apiCallbackFailFunction) apiCallbackFailFunction();
        }
      })
      .catch((error: AxiosError) => {
        setPopupText(error.message);

        if (apiCallbackFailFunction) apiCallbackFailFunction();
        console.error('[ERROR] : Post_CreationDraftArticles -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
      });
  };

  const onPostHookAPI_InputText = async (is_retry?: boolean) => {
    const formData = new FormData();
    formData.append('input_text', input_text);
    formData.append('input_type', input_type_1or2 as any);
    formData.append('is_retry', is_retry ?? (false as any));
    formData.append('model_name', model_name ?? '');

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticles>>(url, formData, CONFIG_HEADER_FORMDATA)
      .then((response: AxiosResponse) => {
        const responseData: Interface_Response_OneResult = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          setReturnAPIData(responseData.result?.result_data);
          setSeqID(responseData.result?.seq_id ?? 0);

          if (callbackFunction) callbackFunction();
        } else {
          setPopupText(responseData.msg);

          if (apiCallbackFailFunction) apiCallbackFailFunction();
        }
      })
      .catch((error: AxiosError) => {
        setPopupText(error.message);

        if (apiCallbackFailFunction) apiCallbackFailFunction();

        console.error('[ERROR] : Post_CreationDraftArticles -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
      });
  };

  return {
    returnAPIData,
    returnSeqID,
    error,
    onPostHookAPI_BinaryBlob,
    onPostHookAPI_InputText,
  };
};

interface Interface_Response_Tuple extends Interface_Basic {
  result: {
    result_data: {
      title: string;
      subtitle: string;
    };

    completion_tokens?: number;
    prompt_tokens?: number;

    total_tokens?: number;
  };
}
export const PostHook_CreationDraftArticleTitle = (
  url: string,
  { article_text, model_name }: Interface_DraftArticleText,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
) => {
  const [returnAPITitle, setReturnAPITitle] = useState<string>('');
  const [returnAPISubtitle, setReturnAPISubtitle] = useState<string>('');
  const [errorAPITitle, setErrorAPITitle] = useState<string>('');

  const onPostHookAPI_Title = async (seqID: number, retry_type?: string) => {
    const jsonData = {
      seq_id: seqID,
      article_text: article_text,
      model_name: model_name ?? 'gpt-4o',
      retry_type: retry_type ?? null,
    };

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticleText>>(url, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        const responseData: Interface_Response_Tuple = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          const tupleData = responseData.result?.result_data;

          if (tupleData?.title?.length > 1) setReturnAPITitle(tupleData?.title);

          if (tupleData?.subtitle?.length > 1) setReturnAPISubtitle(tupleData?.subtitle);
        } else {
          setPopupText(responseData.msg);
        }
      })
      .catch((error: AxiosError) => {
        setPopupText(error.message);
        console.error('[ERROR] : PostHook_CreationDraftArticleTitle -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return {
    returnAPITitle,
    returnAPISubtitle,
    errorAPITitle,
    onPostHookAPI_Title,
  };
};

interface Interface_Response_OneResult extends Interface_Basic {
  result: {
    result_data: string;

    completion_tokens?: number;
    prompt_tokens?: number;
    seq_id?: number;
    total_tokens?: number;
  };
}
export const PostHook_CreationDraftArticleSummary = (
  url: string,
  { article_text, model_name }: Interface_DraftArticleText,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
) => {
  const [returnAPISummary, setReturnAPISummary] = useState<string>();
  const [errorAPISummary, setErrorAPISummary] = useState<string>('');

  const onPostHookAPI_Summary = async (seqID: number) => {
    const jsonData = {
      seq_id: seqID,
      article_text: article_text,
      model_name: model_name ?? 'gpt-4o',
    };

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticleText>>(url, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        const responseData: Interface_Response_OneResult = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          setReturnAPISummary(responseData.result?.result_data);
        } else {
          setPopupText(responseData.msg);
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPISummary(error.message);
        console.error('[ERROR] : PostHook_CreationDraftArticleText -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
        setPopupText(error.message);
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return { returnAPISummary, errorAPISummary, onPostHookAPI_Summary };
};

interface Interface_Response_Array extends Interface_Basic {
  result: {
    result_data: {
      keywords: string[];
    };

    completion_tokens?: number;
    prompt_tokens?: number;

    total_tokens?: number;
  };
}
export const PostHook_CreationDraftArticleKeyword = (
  url: string,
  { article_text, model_name }: Interface_DraftArticleText,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
) => {
  const [returnAPIArrayKeyword, setReturnAPIArrayKeyword] = useState<string[]>();
  const [errorAPIKeyword, setErrorAPIKeyword] = useState<string>('');

  const onPostHookAPI_Keyword = async (seqID: number) => {
    const jsonData = {
      seq_id: seqID,
      article_text: article_text,
      model_name: model_name ?? 'gpt-4o',
    };

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticleText>>(url, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        const responseData: Interface_Response_Array = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          setReturnAPIArrayKeyword([...responseData.result?.result_data?.keywords]);
        } else {
          setPopupText(responseData.msg);
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPIKeyword(error.message);
        console.error('[ERROR] : PostHook_CreationDraftArticleKeyword -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
        setPopupText(error.message);
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return { returnAPIArrayKeyword, errorAPIKeyword, onPostHookAPI_Keyword };
};

export const PostHook_CreationDraftArticleRule = (
  { article_text, model_name }: Interface_DraftArticleText,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
) => {
  const [returnAPIDangerousTagRule, setReturnAPIDangerousTagRule] = useState<string>();
  const [returnAPIPureDraftRule, setReturnAPIPureDraftRule] = useState<string>();
  const [errorAPIDraftRule, setErrorAPIDraftRule] = useState<string>('');

  const onPostHookAPI_Rule = async (seqID: number, subURL: string, editedText?: string) => {
    if (!subURL || subURL.length < 1) {
      return;
    }

    const full_URL = API_URL.Draft.Rule + subURL;

    const jsonData = {
      seq_id: seqID,
      article_text: editedText ?? article_text,
      model_name: model_name ?? 'gpt-4o',
    };

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticleText>>(full_URL, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        const responseData: Interface_FinalOutput = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          setReturnAPIDangerousTagRule(responseData.result.result_data);
          setReturnAPIPureDraftRule(responseData.result.final_output);
        } else {
          setPopupText(responseData.msg);
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPIDraftRule(error.message);
        console.error('[ERROR] : PostHook_CreationDraftArticleRule -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
        setPopupText(error.message);
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return {
    returnAPIDangerousTagRule,
    returnAPIPureDraftRule,
    errorAPIDraftRule,
    onPostHookAPI_Rule,
  };
};

interface Interface_SaveToLibrary {
  title: string;
  subtitle: string | null;
  contents: string;
  summary: string | null;
  press_type: number;
  press_text: string;

  keywords: string[] | null;
  category_name: string[];
}
interface Interface_SecondResponse {
  code: string;
  msg: string;
  sys_msg?: string;
}
export const PostHook_SaveToLibrary = (
  url: string,
  { title, subtitle, contents, summary, press_type, press_text, keywords, category_name }: Interface_SaveToLibrary,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
) => {
  const [isSaveAPISuccess, setSaveAPISuccess] = useState<boolean>();
  const [errorAPILibrary, setErrorAPILibrary] = useState<string>('');

  const onPostHookAPI_SaveToLibrary = async (seqID: number) => {
    if (!contents || contents.length < 1 || contents.includes('</') || contents.includes('/>')) {
      alert('[ERROR - PostHook_SaveToLibrary] -> check contents value : ' + contents);

      return;
    } else if (!title || title.length < 1) {
      alert('[ERROR - PostHook_SaveToLibrary] -> check the title : ' + title);

      return;
    }
    const jsonData = {
      title: title,
      subtitle: subtitle,
      contents: contents,
      summary: summary,
      press_type: press_type,
      press_text: press_text,

      seq_id: seqID,

      keywords: keywords,
      category_name: category_name,
    };

    await AxiosInstance.post<AxiosResponse<Interface_SaveToLibrary>>(url, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        const secondResponse: Interface_SecondResponse = response.data;

        if (response?.status === Readonly.HTTP_CODE.OK_PASS_200) {
          const isSuccess = secondResponse?.code === Readonly.HTTP_CODE.OK_PASS_0000;
          setSaveAPISuccess(isSuccess);

          if (isSuccess === false) {
            setPopupText(secondResponse?.sys_msg as string);
          }
        } else {
          setPopupText(response.statusText);
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPILibrary(error.message);
        console.error('[ERROR] : PostHook_SaveToLibrary -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
        setPopupText(error.message);
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return { isSaveAPISuccess, errorAPILibrary, onPostHookAPI_SaveToLibrary };
};

interface Interface_FinalOutput {
  code: string;
  msg: string;
  result: {
    final_output: string;
    result_data: string;
    completion_tokens?: number;
    prompt_tokens?: number;
    total_tokens?: number;
  };
}
export const PostHook_MouseDragEvent = (
  { article_text, model_name }: Interface_DraftArticleText,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
) => {
  const [returnAPIMouseDragText, setReturnAPIMouseDragText] = useState<string>();
  const [returnAPIDangerouseDragTag, setReturnAPIDangerouseDragTag] = useState<string>();
  const [errorAPIMouseDragText, setErrorAPIMouseDrag] = useState<string>('');

  const onPostHookAPI_MouseDrag = async (seqID: number, subURL: string, editedText?: string) => {
    if (!article_text || article_text.length < 1) {
      alert('[ERROR] check mouse drag length : ' + article_text?.length);
      return;
    } else if (!subURL || subURL.length < 1) {
      alert('[ERROR] onPostHookAPI_MouseDrag subURL is null.');

      return;
    }

    const full_URL = API_URL.Draft.MouseDragEvent + subURL;

    const jsonData = {
      seq_id: seqID,
      article_text: editedText ?? article_text,
      model_name: model_name ?? 'gpt-4o',
    };

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticleText>>(full_URL, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        const responseData: Interface_FinalOutput = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          setReturnAPIMouseDragText(responseData.result.final_output);
          setReturnAPIDangerouseDragTag(responseData.result.result_data);
        } else {
          setPopupText(responseData.msg);
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPIMouseDrag(error.message);
        console.error('[ERROR] : PostHook_CreationDraftArticleRule -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
        setPopupText(error.message);
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  const onPostHookAPI_MouseDragForQuotation = async (seqID: number, subURL: string, speaker: string, quote: string, editedText?: string) => {
    if (!article_text || article_text.length < 1) {
      alert('[ERROR] check mouse drag length : ' + article_text?.length);
      return;
    } else if (!subURL || subURL.length < 1) {
      alert('[ERROR] onPostHookAPI_MouseDragForQuotation subURL is null.');

      return;
    }

    const full_URL = API_URL.Draft.MouseDragEvent + subURL;

    const jsonData = {
      seq_id: seqID,
      speaker: speaker,
      quote: quote,
      article_text: editedText ?? article_text,
    };

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticleText>>(full_URL, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        const responseData: Interface_FinalOutput = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          setReturnAPIMouseDragText(responseData.result.final_output);
          setReturnAPIDangerouseDragTag(responseData.result.result_data);
        } else {
          setPopupText(responseData.msg);
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPIMouseDrag(error.message);
        console.error('[ERROR] : PostHook_CreationDraftArticleRule -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
        setPopupText(error.message);
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return {
    returnAPIMouseDragText,
    returnAPIDangerouseDragTag,
    errorAPIMouseDragText,
    onPostHookAPI_MouseDrag,
    onPostHookAPI_MouseDragForQuotation,
  };
};

interface Interface_CreationInterview {
  input_type_1or2: number;
  input_text: string;
  uploaded_file: File | null;
  interview_purpose: string;

  interview_tone?: string;
  model_name?: string;
}
interface Interface_Response_InterviewArray {
  code: string;
  msg: string;
  result: string[] | string;
}
const isTypeofString = (item: string | string[]) => {
  return typeof item === 'string' || item instanceof String;
};
const valueChecker = (value: string | null | undefined) => {
  return value && value?.length > 0 ? value : undefined;
};
const PUBLIC_TONE = '공식적';
export const PostHook_CreationInterview = (
  url: string,
  { input_text, input_type_1or2, uploaded_file, interview_purpose, interview_tone, model_name }: Interface_CreationInterview,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
  apiCallbackFailFunction?: () => void,
) => {
  const [returnAPIInterviewTextArray, setReturnAPIInterviewTextArray] = useState<string[]>([]);
  const [errorAPIInterview, setErrorAPIInterview] = useState<string>('');
  const [returnAPIAddInterviewItem, setReturnAPIAddInterviewItem] = useState<string>('');

  const onPostHookAPI_BinaryBlob = async (tone?: string, endpoint?: string, interviewItemArray?: string[]) => {
    const binaryBlob = await getBinaryBlobFrom(uploaded_file);

    if (input_type_1or2 < 1)
      throw Object.assign(new Error(), {
        code: Readonly.HTTP_CODE.BAD_REQUEST_400,
        message: 'check input type for API : ' + input_type_1or2,
      });
    else if (!binaryBlob || binaryBlob?.size === 0)
      throw Object.assign(new Error(), {
        code: Readonly.HTTP_CODE.BAD_REQUEST_400,
        message: 'binaryBlob is undefined or size zero.',
      });

    const formData = new FormData();
    formData.append('input_text', input_text);
    formData.append('input_type', input_type_1or2 as any);
    formData.append('uploaded_file', binaryBlob);
    formData.append('model_name', model_name ?? '');
    formData.append('file_name', uploaded_file?.name ?? 'unknown_file');

    if (interviewItemArray && interviewItemArray.length > 0) formData.append('interview_question', JSON.stringify(interviewItemArray));
    else {
      formData.append('interview_purpose', interview_purpose);
      formData.append('interview_tone', valueChecker(tone) ?? valueChecker(interview_tone) ?? PUBLIC_TONE);
    }

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticles>>(endpoint ?? url, formData, CONFIG_HEADER_FORMDATA)
      .then((response: AxiosResponse) => {
        const responseData: Interface_Response_InterviewArray = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          if (isTypeofString(responseData.result)) setReturnAPIAddInterviewItem(responseData?.result as string);
          else setReturnAPIInterviewTextArray([...responseData.result]);

          if (callbackFunction) callbackFunction();
        } else {
          setPopupText(responseData.msg);
          if (apiCallbackFailFunction) apiCallbackFailFunction();
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPIInterview(error.message);
        console.error('[ERROR] : Post_CreationInterview -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });

        setPopupText(error.message);
        if (apiCallbackFailFunction) apiCallbackFailFunction();
      });
  };

  const onPostHookAPI_InputText = async (tone?: string, endpoint?: string, interviewItemArray?: string[]) => {
    const formData = new FormData();
    formData.append('input_text', input_text);
    formData.append('input_type', input_type_1or2 as any);

    formData.append('model_name', model_name ?? '');

    if (interviewItemArray && interviewItemArray.length > 0) formData.append('interview_question', JSON.stringify(interviewItemArray));
    else {
      formData.append('interview_purpose', interview_purpose);
      formData.append('interview_tone', valueChecker(tone) ?? valueChecker(interview_tone) ?? PUBLIC_TONE);
    }

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticles>>(endpoint ?? url, formData, CONFIG_HEADER_FORMDATA)
      .then((response: AxiosResponse) => {
        const responseData: Interface_Response_InterviewArray = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          if (isTypeofString(responseData.result)) setReturnAPIAddInterviewItem(responseData?.result as string);
          else setReturnAPIInterviewTextArray([...responseData.result]);

          if (callbackFunction) callbackFunction();
        } else {
          setPopupText(responseData.msg);
          if (apiCallbackFailFunction) apiCallbackFailFunction();
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPIInterview(error.message);
        console.error('[ERROR] : Post_CreationInterview -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
        setPopupText(error.message);
        if (apiCallbackFailFunction) apiCallbackFailFunction();
      });
  };

  return {
    returnAPIInterviewTextArray,
    returnAPIAddInterviewItem,
    errorAPIInterview,
    onPostHookAPI_BinaryBlob,
    onPostHookAPI_InputText,
  };
};

export const PostHook_InterviewToneChange = (
  url: string,
  companyInfo: useInfo,
  setPopupText: (value: React.SetStateAction<string>) => void,
  callbackFunction?: () => void,
) => {
  const [returnAPIChangeToneArray, setReturnAPIChangeToneArray] = useState<string[]>([]);
  const [errorAPIToneArray, setErrorAPIToneArray] = useState<string>('');

  const onPostHookAPI_ToneJson = async (interview_tone: string, interview_question: string[]) => {
    const jsonData = {
      interview_tone: valueChecker(interview_tone) ?? PUBLIC_TONE,
      interview_question: interview_question,
      model_name: 'gpt-4o',
    };

    await AxiosInstance.post<AxiosResponse<Interface_DraftArticles>>(url, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        const responseData: Interface_Response_InterviewArray = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) setReturnAPIChangeToneArray([...responseData.result]);
        else {
          setPopupText(responseData.msg);
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPIToneArray(error.message);
        console.error('[ERROR] : PostHook_InterviewToneChange -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
        setPopupText(error.message);
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return {
    returnAPIChangeToneArray,
    errorAPIToneArray,
    onPostHookAPI_ToneJson,
  };
};

export interface Interface_LibraryItem {
  category_name: string[];
  contents: string;
  keywords: string[];
  subtitle: string;
  summary: string;
  title: string;
  file_size: number;

  upddate: string;
  regdate: string;

  press_type: number;
  press_text?: string;

  seq_id: number;
  user_num: string;
  mid: number;
  is_use: boolean;
  file_path: string;
  file_name: string;
}
interface Interface_MyLibrary {
  code: string;
  msg: string;
  result: {
    data: Interface_LibraryItem[];
    total: number;
  };
}
export const GetHook_MyLibraryList = (url: string, companyInfo: useInfo, callbackFunction?: () => void) => {
  const [returnAPILibraryList, setReturnAPILibraryList] = useState<Interface_LibraryItem[]>([]);
  const [returnAPILibraryListLength, setReturnAPILibraryListLength] = useState<number>();
  const [errorAPILibraryList, setErrorAPILibraryList] = useState<string>('');

  const onGetHookAPI_LibraryList = async (pageNumber: number, rows?: number) => {
    const jsonData = {
      pageno: pageNumber,
      rows: rows ?? 15,
    };

    await AxiosInstance.get<AxiosResponse<Interface_DraftArticleText>>(url, {
      params: jsonData,
    })
      .then((response: AxiosResponse) => {
        const responseData: Interface_MyLibrary = response?.data;

        if (responseData?.code === Readonly.HTTP_CODE.OK_PASS_0000) {
          setReturnAPILibraryList([...responseData.result.data]);
          setReturnAPILibraryListLength(responseData.result.total);
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPILibraryList(error.message);
        console.error('[ERROR] : GetHook_MyLibraryList -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return {
    returnAPILibraryList,
    returnAPILibraryListLength,
    errorAPILibraryList,
    onGetHookAPI_LibraryList,
  };
};

export const DeleteHook_MyLibraryItem = (url: string, companyInfo: useInfo, callbackFunction?: () => void) => {
  const [returnAPILibraryDeleteResult, setReturnAPILibraryDeleteResult] = useState<boolean>(false);
  const [errorAPILibraryDeleteResult, setErrorAPILibraryDeleteResult] = useState<string>('');

  const onDeleteHookAPI_LibraryItem = async (delete_seq_id: number) => {
    const deleteJsonData = {
      seq_id: delete_seq_id,
    };

    await AxiosInstanceDelete.delete<AxiosResponse<Interface_DraftArticleText>>(url, { data: JSON.stringify(deleteJsonData) })
      .then((response: AxiosResponse) => {})
      .catch((error: AxiosError) => {
        setErrorAPILibraryDeleteResult(error.message);
        console.error('[ERROR] : onDeleteHookAPI_LibraryItem -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return { errorAPILibraryDeleteResult, onDeleteHookAPI_LibraryItem };
};

interface Interface_LibraryModify {
  seq_id: number;
  title: string;
  subtitle: string;
  contents: string;
  keywords: string[] | null;
  summary: string;
  category_name: string[] | null;
}
export const PutHook_MyLibraryItem = (url: string, companyInfo: useInfo, callbackFunction?: () => void) => {
  const [errorAPILibraryPutResult, setErrorAPILibraryPutResult] = useState<string>('');

  const onPutHookAPI_LibraryItem = async ({ seq_id, contents, title, keywords, subtitle, summary, category_name }: Interface_LibraryModify) => {
    const putJsonData = {
      seq_id: seq_id,
      contents: contents,
      title: title,
      keywords: keywords,
      subtitle: subtitle ?? '',
      summary: summary ?? '',
      category_name: category_name,
    };

    await AxiosInstance.put<AxiosResponse<Interface_DraftArticleText>>(url, putJsonData)
      .then((response: AxiosResponse) => {})
      .catch((error: AxiosError) => {
        setErrorAPILibraryPutResult(error.message);
        console.error('[ERROR] : onPutHookAPI_LibraryItem -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return { errorAPILibraryPutResult, onPutHookAPI_LibraryItem };
};

interface Interface_DownloadItem {
  fileName: string;
  blobItem: Blob;
}
export const PostHook_LibraryItemDownload = (url: string, companyInfo: useInfo, callbackFunction?: () => void) => {
  const [returnAPIDownloadItem, setReturnAPIDownloadItem] = useState<Interface_DownloadItem>();
  const [errorAPIDownloadItem, setErrorAPIDownloadItem] = useState<string>('');

  const onPostHookAPI_ItemDownload = async (file_path: string, file_name: string) => {
    const jsonData = {
      file_path: file_path,
      file_name: file_name,
    };

    await AxiosInstanceFileDownload.post<AxiosResponse<Interface_DraftArticles>>(url, JSON.stringify(jsonData), CONFIG_HEADER_JSON)
      .then((response: AxiosResponse) => {
        if (response?.status === Readonly.HTTP_CODE.OK_PASS_200) {
          setReturnAPIDownloadItem({
            fileName: file_name,
            blobItem: new Blob([response.data], {
              type: 'application/octet-stream',
            }),
          });
        }
      })
      .catch((error: AxiosError) => {
        setErrorAPIDownloadItem(error.message);
        console.error('[ERROR] : onPostHookAPI_ItemDownload -> ', {
          message: error.message,
          code: error.code,
          config: error.config,
        });
      })
      .finally(() => {
        if (callbackFunction) callbackFunction();
      });
  };

  return {
    returnAPIDownloadItem,
    errorAPIDownloadItem,
    onPostHookAPI_ItemDownload,
  };
};
