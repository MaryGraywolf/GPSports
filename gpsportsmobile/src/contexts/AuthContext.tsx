import {    createContext, useState, useEffect, ReactNode  } from 'react'
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

export interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({   children    }: AuthProviderProps){
    const [user, setUser] = useState<UserProps>({} as UserProps)
    const [isUserLoading, setIsUserLoading] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '1033335813138-smupaq46quj4f78q49kgbjeadl390dp4.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true}),
        scopes: ['profile', 'email']
    });

        async function signIn(){
            try{
                setIsUserLoading(true);
                await promptAsync();
            } catch (error){
                console.log(error);
                throw error;
            } finally {
                setIsUserLoading(false);
            }
        }

        async function signInWithGoogle(access_token: string ){
            try {

                setIsUserLoading(true);

                //await fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', { access_token })

            }catch (error){
                console.log(error);
                throw error;
            } finally {
                setIsUserLoading(false);
            }
        }

        useEffect(() => {
            if(response?.type === 'success' && response.authentication?.accessToken){
                signInWithGoogle(response.authentication.accessToken)           
            }
        }, [response]);

        return(
            <AuthContext.Provider value={{
                signIn,
                isUserLoading,
                user
            }}>         
                {children}      
            </AuthContext.Provider>
        );
}