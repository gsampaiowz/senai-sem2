import React, { useCallback, useContext, useEffect, useState } from "react";
import MainContent from "../../components/MainContent/MainContent";
import Title from "../../components/Title/Title";
import Table from "./TableEva/Table";
import Container from "../../components/Container/Container";
import { Select } from "../../components/FormComponents/FormComponents";
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import api from "../../Services/Service";

import "./EventosAlunoPage.css";
import { userContext } from "../../context/AuthContext";
import Notification from "../../components/Notification/Notification";
import { motion } from 'framer-motion';

const EventosAlunoPage = () => {
  const [eventos, setEventos] = useState([]);
  // select mocado
  const quaisEventos = [
    { value: "1", text: "Todos os eventos" },
    { value: "2", text: "Meus eventos" },
  ];

  const [notifyUser, setNotifyUser] = useState({});

  const [idEventoComentario, setIdEventoComentario] = useState("");
  const [comentario, setComentario] = useState("");
  const [idComentario, setIdComentario] = useState("");

  const [tipoEvento, setTipoEvento] = useState("1"); //código do tipo do Evento escolhido
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // recupera os dados globais do usuário
  const { userData } = useContext(userContext);

  const getEventos = useCallback(async () => {
    setShowSpinner(true);
    try {
      const promise = await api.get("/Evento");
      const promiseEventos = await api.get(
        `/PresencasEvento/ListarMinhas/${userData.userId}`
      );
      if (tipoEvento === "1") {
        verificaPresenca(promise.data, promiseEventos.data);
        setEventos(promise.data);
      } else {
        let novosEventos = [];

        promiseEventos.data.forEach((e) => {
          novosEventos.push({
            ...e.evento,
            idPresencaEvento: e.idPresencaEvento,
            situacao: e.situacao,
          });
        });
        setEventos(novosEventos);
      }
    } catch (error) {
      console.error("Erro ao carregar eventos: " + error);
    }
    setShowSpinner(false);
  }, [userData, tipoEvento])

  //verificar presença
  const verificaPresenca = (arrAllEvents, eventsUser) => {
    for (let x = 0; x < arrAllEvents.length; x++) {
      //para cada evento (todos)
      //verifica se o aluno está participando do evento atual (x)
      for (let i = 0; i < eventsUser.length; i++) {
        if (arrAllEvents[x].idEvento === eventsUser[i].evento.idEvento) {
          arrAllEvents[x].situacao = true;
          arrAllEvents[x].idPresencaEvento = eventsUser[i].idPresencaEvento;
          break;
        }
      }
    }

    return arrAllEvents;
  };

  //LISTAGEM DE EVENTOS
  useEffect(() => {
    //chamar a api
    getEventos();
  }, [userData, tipoEvento, getEventos]);

  const showHideModal = (idEvento) => {
    setShowModal(showModal ? false : true);
    setIdEventoComentario(idEvento);
  };

  async function loadMyComentary() {
    const promiseComentario = await api.get(
      `/ComentariosEvento/BuscarPorIdUsuario?idUsuario=${userData.userId}&idEvento=${idEventoComentario}`
    );
    setComentario(promiseComentario.data.descricao);
    setIdComentario(promiseComentario.data.idComentarioEvento);
  }

  const commentaryRemove = async () => {
    if (idComentario === undefined) {
      setNotifyUser({
        titleNote: "Aviso",
        textNote: `Não há comentário para deletar`,
        imgIcon: "warning",
        imgAlt:
          "Imagem de ilustração de aviso. Moça pisando em um símbolo de exclamação.",
        showMessage: true,
      });
      return;
    }
    try {
      await api.delete(`/ComentariosEvento/${idComentario}`);
      setComentario();
      setNotifyUser({
        titleNote: "Comentário apagado!",
        textNote: `Seu comentário foi apagado com sucesso.`,
        imgIcon: "success",
        imgAlt:
          "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
        showMessage: true,
      });
    } catch (error) {
      console.log("Erro ao apagar comentário" + error);
      setNotifyUser({
        titleNote: "Erro",
          textNote: `Falha ao comentar!`,
        imgIcon: "danger",
        imgAlt: "Imagem de ilustração de perigo.",
        showMessage: true,
      });
    }
  };

  const commentaryAdd = async (commentary) => {
    if (commentary.length < 3) return;
    const promise = await api.post(`/ComentariosEvento/Cadastra IA`, {
      descricao: commentary,
      exibe: true,
      idUsuario: userData.userId,
      idEvento: idEventoComentario,
    });
    setComentario(commentary);
    setIdComentario(promise.data.idComentarioEvento);
    setNotifyUser({
      titleNote: "Comentário adicionado!",
      textNote: `Comentário adicionado com sucesso!`,
      imgIcon: "success",
      imgAlt:
        "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
      showMessage: true,
    });
  };

  const commentaryEdit = async (commentary) => {
    // await api.put(`/ComentariosEvento/${idComentario}`, {
    //   descricao: commentary,
    //   exibe: true,
    //   idUsuario: userData.userId,
    //   idEvento: idEventoComentario,
    // });
    // setComentario(commentary);
  };

  async function handleConnect(idEvent, idPresent, connect = false) {
    if (connect === true) {
      try {
        await api.post("/PresencasEvento", {
          situacao: true,
          idUsuario: userData.userId,
          idEvento: idEvent,
        });
        getEventos();
        setNotifyUser({
          titleNote: "Presença confirmada!",
          textNote: `Sua presença no evento foi confirmada com sucesso!`,
          imgIcon: "success",
          imgAlt:
            "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
          showMessage: true,
        });
      } catch (error) {
        console.log("Erro ao conectar" + error);
        setNotifyUser({
          titleNote: "Erro",
          textNote: `Falha ao conectar!`,
          imgIcon: "danger",
          imgAlt: "Imagem de ilustração de perigo.",
          showMessage: true,
        });
      }
      return;
    }
    //unconnect
    try {
      await api.delete(`/PresencasEvento/${idPresent}`);
      getEventos();
      setNotifyUser({
        titleNote: "Presença cancelada!",
        textNote: `Sua presença no evento foi cancelada com sucesso.`,
        imgIcon: "success",
        imgAlt:
          "Imagem de ilustração de sucesso. Moça segurando um balão com símbolo de confirmação ok.",
        showMessage: true,
      });
    } catch (error) {
      console.log("Erro ao desconectar" + error);
      setNotifyUser({
        titleNote: "Erro",
        textNote: `Falha ao desconectar!`,
        imgIcon: "danger",
        imgAlt: "Imagem de ilustração de perigo.",
        showMessage: true,
      });
    }
  }

  return (
    <>
      <MainContent>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Notification {...notifyUser} setNotifyUser={setNotifyUser} />
        <Container>
          <Title titleText={"Eventos"} additionalClass="margem-acima" />

          <Select
            id="id-tipo-evento"
            name="tipo-evento"
            hasDefaultOption={false}
            required={true}
            object={quaisEventos}
            mapOption={(option) => (
              <option value={option.value} key={option.value}>
                {option.text}
              </option>
            )}
            manipulationFunction={(e) => {
              setTipoEvento(e.target.value);
            }} // aqui só a variável state
            value={tipoEvento}
            additionalClass="select-tp-evento"
          />
          <Table
            dados={eventos}
            fnConnect={handleConnect}
            fnShowModal={showHideModal}
          />
        </Container>
        </motion.div>
      </MainContent>

      {/* SPINNER -Feito com position */}
      {showSpinner ? <Spinner /> : null}

      {showModal ? (
        <Modal
          userId={userData.userId}
          showHideModal={showHideModal}
          fnDelete={commentaryRemove}
          fnPost={commentaryAdd}
          fnPut={commentaryEdit}
          fnGet={loadMyComentary}
          comentaryText={comentario}
        />
      ) : null}
    </>
  );
};

export default EventosAlunoPage;
