import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

type WordsPerPageContextType = 15 | 30 | 60;

type WordsPerPageContextValue = {
    wordsPerPage: WordsPerPageContextType;
    setWordsPerPage: Dispatch<SetStateAction<WordsPerPageContextType>>
}

type ContextProviderProps = { children?: ReactNode };

const defaultValue: WordsPerPageContextValue = {
    wordsPerPage: 30,
    setWordsPerPage: () => {},
}

const WordsPerPageContext = createContext<WordsPerPageContextValue>(defaultValue);

export const ContextProvider = ({ children }: ContextProviderProps) => {
	const [wordsPerPage, setWordsPerPage] = useState<WordsPerPageContextType>(defaultValue.wordsPerPage);
	
	useEffect(() => {
        const getInitialValue = (): WordsPerPageContextType => {
            const stored = localStorage.getItem("wordsPerPage");
            if (stored === "15" || stored === "30" || stored === "60") {
                return parseInt(stored) as WordsPerPageContextType;
            }
            return defaultValue.wordsPerPage;
        }
        setWordsPerPage(getInitialValue());
    }, []);

	useEffect(() => {
		localStorage.setItem("wordsPerPage", wordsPerPage.toString());
	}, [wordsPerPage])

	return (
		<WordsPerPageContext.Provider value={{wordsPerPage, setWordsPerPage}}>
			{children}
		</WordsPerPageContext.Provider>
	);
};

export const useWordsPerPage = () => useContext(WordsPerPageContext);