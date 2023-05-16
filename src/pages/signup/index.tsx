import React, { useState, FormEvent, useContext } from "react";
import Head from 'next/head';
import Image from "next/image";
import Link from "next/link";
import { toast } from 'react-toastify';

import { AuthContext } from "../../contexts/AuthContext";
import styles from '../../../styles/home.module.scss'
import logoImg from '../../../public/logo.png';

import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function Home() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);


  async function handleSignUp(event: FormEvent){
    event.preventDefault();

    if(name === "" || email === "" || password === ""){
      toast.error("Preencha todos os campos!")
      return;
    }

    setLoading(true)

    let data = {
      name,
      email,
      password
    }
    await signUp(data)

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title> Pizzaria Capone - Faça seu cadastro agora! </title>
      </Head>
      <div className={styles.containerCenter}>
        <Image className={styles.logo} src={logoImg} alt="logo Pizzaria Capone" />

        <div className={styles.login}>
            <h1> Criando a sua conta </h1>

          <form onSubmit={ handleSignUp }>
              <Input
                placeholder="Nome Completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            <Input
                placeholder="Digite seu email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                placeholder="Sua senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                loading={loading}
              >
                Cadastrar
              </Button>
          </form>

          <Link href="/"  className={styles.text}>
             Já possui uma conta? Acessar
          </Link>
          
        </div>
      </div>
    </>
  )
}
