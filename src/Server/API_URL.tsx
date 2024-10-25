export const BASE_URL_PORT = process.env.REACT_APP_BASE_URL_PORT as string;
export const BASE_URL = process.env.REACT_APP_BASE_URL as string;
export const BASE_PORT = Number(process.env.REACT_APP_BASE_PORT);

const Draft = {
  Creation: '/jcopilot/draft/',
  Title: '/jcopilot/draft/title',
  Summary: '/jcopilot/draft/summary',
  Keyword: '/jcopilot/draft/keyword',
  Rule: '/jcopilot/draft/rule',
  MouseDragEvent: '/jcopilot/draft',
};

const Interview = {
  Creation: '/jcopilot/interview/',
  AddItem: '/jcopilot/interview/add',
  Tone: '/jcopilot/interview/tone',
};

const API_URL = {
  Draft,
  Interview,
};

export default API_URL;
