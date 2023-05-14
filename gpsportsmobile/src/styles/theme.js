import { extendTheme } from "native-base";

export const theme = extendTheme({
    colors: {
        gray:{
            950: '#09090A',
            900: '#121214',
            800: '#202024',
            600: '#323238',
            300: '#8D8D99',
            200: '#C4C4CC',
        },
        purple:{
            900: '#581c87',
            800: '#6b21a8',
            600: '#9333ea',
            300: '#d8b4fe',
            200: '#e9d5ff'

        }
    },
    fonts: {
        heading: 'Roboto_700Bold',
        body: 'Roboto_400Regular',
        medium: 'Roboto_500Medium'
    },
    fontSizes:{
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
    },
    sizes: {
        14: 56
    }
});