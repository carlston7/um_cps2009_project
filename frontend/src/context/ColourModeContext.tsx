import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { createContext, useMemo, useState } from "react";


export const ColorModeContext = createContext({
    toggleColorMode: () => { },
    currentTheme: 'dark'
});


export default function ColorModeProvider(props: { children: React.ReactNode }) {
    const [mode, setMode] = useState<'light' | 'dark'>(
        localStorage.getItem('colorMode') === 'dark' ? 'dark' : 'light'
    );

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => {
                const updatedMode = prevMode === 'light' ? 'dark' : 'light';
                localStorage.setItem('colorMode', updatedMode);
                return updatedMode;
            });
        },
    }), []);

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            primary: {
                main: mode === 'dark' ? '#097969' : '#0BDA51',
            },
        },
    }), [mode]);

    return (
        <ColorModeContext.Provider value={{ toggleColorMode: colorMode.toggleColorMode, currentTheme: mode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {props.children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}
