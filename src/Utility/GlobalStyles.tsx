import Readonly from 'Readonly/Readonly';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    body {
		min-height: 100%;
        overflow-x: hidden !important;
    }

	html {
    	height: 100%;
	}


	&::-webkit-scrollbar {
        scroll-behavior: smooth;
		width: 6px;
	}


	&::-webkit-scrollbar-track {

	}


	&::-webkit-scrollbar-thumb {
        background-clip: padding-box;
        border: 10px solid transparent;
		background: ${Readonly.Color.Dashed_C8CFE8};
        border-radius: 10px;
	}
`;
