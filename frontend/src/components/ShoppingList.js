import React, {useState, useRef} from "react";
import api from "../services/api"; // Importa o serviço axios
import Message from "./Message";
import emptyCartIcon from '../assets/empty-cart.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import '../styles/ShoppingList.css';


function ShoppingList({items, setItems}) {
 
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const refs = useRef({});

  // Adicionar um novo item ao backend
  const addItem = (event) => {
    if (input.trim() !== "") {
      api.post("/shopping-list", { name: input }) // Envia o item para o backend
        .then(response => {
          setItems(prevItems => [...prevItems, response.data]);
          setInput("");
          setMessage("Item adicionado com Sucesso !");
          // Animação do ponto
          const point = document.createElement("div");
          point.className = "floating-point";
          document.body.appendChild(point);
          console.log("Bolinha criada: ", point); // Verificar se está sendo criada

          // Pega o botão clicado
          const addButton = event.target; // Botão clicado
          const cartIcon = document.querySelector("#cart-counter");
          console.log("Botão clicado: ", addButton); // Depuração

          // Calcula posições
          const startX = addButton.getBoundingClientRect().left + 20;
          const startY = addButton.getBoundingClientRect().top;
          const endX = cartIcon.getBoundingClientRect().left + 10;
          const endY = cartIcon.getBoundingClientRect().top + 10;

          point.style.left = `${startX}px`;
          point.style.top = `${startY}px`;

          // Anima a bolinha
          point.animate(
            [
              { transform: `translate(0, 0)` },
              {
                transform: `translate(${endX - startX}px, ${endY - startY}px)`,
                opacity: 0,
              },
            ],
            {
              duration: 1500, // Velocidade ajustada
              easing: "ease-in-out",
            }
          );

          console.log("Animação aplicada ao ponto");

          setTimeout(() => point.remove(), 1500); // Remove após a animação
        })
        .catch(error => {
          setMessage("Erro ao adicionar o item.");
          console.error("Erro ao adicionar item:", error);
        });
    } else {
      setMessage("O campo está vazio. Digite algo!");
    }
    //Remover mensagem em 3 segundos
    setTimeout(() => setMessage(""), 3000);
  }

  const removeItem = (id) => {
    api.delete(`/shopping-list/${id}`) // Remove o item do backend
      .then(() => {
        setItems(prevItems => prevItems.filter(item => item.id !== id)); // Atualiza a lista localmente
        setMessage("Item removido com sucesso!");
      })
      .catch(error => {
        setMessage("Erro ao remover o item.");
        console.error("Erro ao remover item:", error);
      });
      //remover mensagem em 3 segundos
      setTimeout(() => setMessage(""), 3000);
  };

    // Função para atualizar a quantidade de um item
    const updateQuantity = (id, quantity) => {
      const newQuantity = Math.max(1, quantity); // Garante que a quantidade mínima é 1
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    };
  
    // Função para calcular o total estimado
    const calculateTotal = () => {
      return items.reduce((total, item) => {
        return total + (item.quantity || 1) * (item.price || 0); // Considera quantidade e preço
      }, 0).toFixed(2);
    };

  return (
    
    <div style={{ margin: "10px"}}>
      <Message text={message} />
      <h1>Lista de Compras</h1>
      <h2>Total de Itens: {items.length}</h2>
      <div>
        <input
          type="text"
          placeholder="Adicionar item..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="addListItem" onClick={(e) => addItem(e)}>Adicionar</button>
      </div>
        {
        items.length === 0 ? (
          <div key="empty-list" style={{textAlign: "center", marginTop: "20px"}}>
            <img
              src={emptyCartIcon}
              alt="carrinho vazio"
              style={{width:"150px", opacity: "0.6"}}
              />
            <p style={{color: "gray", margin: "10px 0"}}>Nenhum item na Lista de Compras</p>
          </div>
        ):(
        <div>
          <TransitionGroup component="ul">
            {items.map((item) => {
              //criando uma Ref para cada item
              if (!refs.current[item.id]) {
                refs.current[item.id] = React.createRef();
              }
              return (
              <CSSTransition 
              key={item.id} 
              timeout={500} 
              classNames="slide"
              nodeRef={refs.current[item.id]}
              >
                <li ref={refs.current[item.id]} style={{marginBottom: "10px"}}>
                  <div className="Lista">
                    <span><strong>{item.name}</strong></span>
                    <span>Preço Unitário: <strong>R$ {item.price?.toFixed(2)}</strong></span>
                    <span>Quantidade:
                      <input
                            type="number"
                            min="1"
                            value={item.quantity || 1}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                            style={{ width: "50px", margin: "0 10px" }}
                        />
                    </span>
                    <span>Total: <strong>R$ {(item.quantity || 1) * item.price?.toFixed(2)}</strong></span>
                    <button className="removeListItem" onClick={() => removeItem(item.id)}>
                      <FontAwesomeIcon icon={faTrash} /> 
                    </button>
                  </div>
                </li>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
        <h3>Total Carrinho: R$ {calculateTotal()}</h3>
      </div>
      )}
    </div>
  );
}

export default ShoppingList;
