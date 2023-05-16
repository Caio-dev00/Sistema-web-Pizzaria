import { FormEvent, useState } from "react"
import Head from "next/head"
import { Header } from "../../components/Header"
import styles from './styles.module.scss'

import { api } from "../../services/apiClient"
import { toast } from "react-toastify"

import { canSSRAuth } from '../../utils/canSSRAuth'

export default function Category() {
    const [name, setName] = useState("");

    async function handleRegister(event: FormEvent){
        event.preventDefault();

        if(name === ""){
            return;
        }

        await api.post('/category', {
            name: name,
        })

        toast.success('Categoria cadastrada com sucesso!')
        setName("");

    }

  return (
    <>
        <Head>
            <title> Nova Categoria - Pizzaria Capone </title>
        </Head>

        <div>
            <Header />
            
            <main className={styles.container}>
                <h1> Cadastrar categorias </h1>

                <form className={styles.form} onSubmit={handleRegister} >
                    <input
                        value={name}
                        type="text"
                        placeholder="Digite o nome da categoria"
                        className={styles.input}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <button className={styles.buttonAdd} type="submit">
                        Cadastrar
                    </button>
                </form>
            </main>
        </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (context) => {

    return {
        props: {}
    }
})
