import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { toast } from 'react-toastify'

import { api } from "../services/apiClient";



type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (credentials: SignUpProps) => Promise<void>;
    signOut: () => void;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}




export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch{
        console.log('Erro ao deslogar')
    }
}


export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() => {

        //Tenta pegar algo no cookie
        const { '@nextauth.token': token } = parseCookies();

        if(token){
            api.get('/me').then(response => {
                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })
            })
            .catch(() => {
                signOut();
            })
        }

    }, [])



    async function signIn({ email, password }: SignInProps){
        try{
            const response = await api.post('/session', {
                email,
                password
            })

            const { id, name, token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // Expires in 30 days
                path: "/" //Witch routes will have access to this cookie
            })

            setUser({
                id,
                name,
                email,
            })

            //Pass our token to the next requests
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success('Logado com sucesso!')

            //Redirect user to dashboard
            Router.push('/dashboard')

        }catch(err){
            toast.error("Erro ao fazer login!")
            console.log("ERRO AO ACESSAR", err)
        }
    }


    async function signUp({ name, email, password }: SignUpProps){
        try{

            const response = await api.post('/users', {
                name,
                email,
                password,
            })

            toast.success("Cadastrado com sucesso!")
            Router.push('/')


        }catch(err){
            toast.error("Erro ao se cadastrar!")
            console.log("ERRO AO CADASTRAR", err)
        }
    }


    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, signOut }}>
            { children }
        </AuthContext.Provider>
    )
}