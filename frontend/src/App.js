import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from './services/api'; // Certifique-se de ter configurado o arquivo API
import ShoppingList from './components/ShoppingList';
import ProductList from './components/ProductList';
import ThemeSwitcher from './components/ThemeSwitcher';
import Geolocation from "./components/Geolocation";
import { filterByRadius } from "./utils";
import Map from "./components/Map";
import 'leaflet/dist/leaflet.css';
import { searchNearbySupermarkets } from "./services/supermarketService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function App() {
    const [produtos, setProdutos] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [supermarkets, setSupermarkets] = useState([]);
    const [locationProcessed, setLocationProcessed] = useState(false);

    //Busca produtos ao carregar o app
    useEffect(() => {
        api.get('/produtos')
            .then(response => {
                console.log("Dados recebidos /produtos da API:", response.data);
                setProdutos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar produtos", error);
                toast.error("Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.", { position: "top-center" });
                setLoading(false);
            });
    }, []);

    // Buscar itens da lista de compras ao carregar a aplicação (e LocalStorage)
    useEffect(() => {
        const savedItems = JSON.parse(localStorage.getItem("shoppingList")) || [];
        setItems(savedItems);

        api.get('/shopping-list')
            .then(response => {
                console.log("Dados recebidos /shopping-list da API:", response.data);
                const validItems = response.data.filter(item => item.id && item.name); // Garante que os itens são válidos
                const uniqueItems = [...new Map(validItems.map(item => [item.id, item])).values()];
                setItems(uniqueItems);
            })
            .catch(error => {
                console.error("Erro ao buscar lista de compras", error);
            });
    }, []);

    // Atualiza o LocalStorage quando a lista de compras é modificada
    useEffect(() => {
        localStorage.setItem("shoppingList", JSON.stringify(items));
    }, [items]);

    //buscar supermercados no raio de 5km
    const handleLocationObtained = async (coords) => {
        if (locationProcessed) return; // Evita executar múltiplas vezes

        setLocationProcessed(true); // Marca como processada
        setUserLocation(coords);

        // Buscar supermercados no raio de 5 km
        const results = await searchNearbySupermarkets({
            latitude: coords.latitude,
            longitude: coords.longitude,
            radius: 5000, // 5 km em metros
        });
        //filtrar resultados
        const filteredSupermarkets = filterByRadius(results, coords, 5000);
        setSupermarkets(filteredSupermarkets);
    };

    // busca na api os Produtos
    const handleSearch = (e) => {
        setSearch(e.target.value);
    
        if (e.target.value.length > 2) {
            setLoading(true);
            api.get('/api/external-products', {
                params: {
                    search_terms: e.target.value,
                    search_simple: 1,
                    json: 1,
                },
            })
            .then(response => {
                setProdutos(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erro na busca dinâmica:", error);
                toast.error("Ocorreu um erro ao realizar a busca.", { position: "top-center" });
                setLoading(false);
            });
        }
    };
    


    // Filtra os produtos com base na busca
    const filteredProdutos = produtos.filter(produto =>
        (produto.product_name || "").toLowerCase().includes(search.toLowerCase())
    );

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    const addToShoppingList = (event, produto) => {
        if (items.some(item => item.name === produto.product_name)) {
            toast.warn("O produto já está na lista.", { position: "top-center" });
            return;
        }

        api.post('/shopping-list', { name: produto.product_name })
            .then(response => {
                setItems(prevItems => [...prevItems, response.data]); // Adiciona diretamente
                console.log(`Produto ${produto.product_name} adicionado à lista de compras!`);
                toast.success(`${produto.product_name} foi adicionado à sua lista de compras!`, { position: "top-center" });
                 // Animação do ponto
                const point = document.createElement("div");
                point.className = "floating-point";
                document.body.appendChild(point);
                console.log("Bolinha criada: ", point); // Verificar se está sendo criada

                // Pega o botão clicado
                const addButton = event.target; // Botão clicado
                const cartIcon = document.querySelector("#cart-counter");
                console.log(addButton.getBoundingClientRect()); // Depuração das coordenadas

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
                console.error("Erro ao adicionar produto à lista de compras:", error);
                toast.error("Ocorreu um erro ao adicionar o produto. Tente novamente.", { position: "top-center" });
            });
    };

    return (
        
        <div className={darkMode ? 'dark-mode' : 'light-mode'}>
            <ThemeSwitcher darkMode={darkMode} toggleTheme={toggleTheme} />
            <div style={{ position: "relative", marginBottom: "20px", textAlign: "right" }}>
                <span
                    id="cart-counter"
                    style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#f00",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "12px",
                    zIndex: 10,
                    }}
                >
                    {items.length}
                </span>
                <img
                    src="carrinho.png" // Atualize com o caminho real da imagem
                    alt="Carrinho de Compras"
                    style={{ width: "50px", height: "50px", marginRight: "10px" }}
                />
            </div>

            <div>
                <h1>Supermercados Próximos</h1>
                {/* Componente de Geolocalização */}
                <Geolocation onLocationObtained={handleLocationObtained} />

                {/* Mostrar o mapa se a localização do usuário estiver disponível */}
                {userLocation && (
                    <Map userLocation={userLocation} supermarkets={supermarkets} />
                )}
            </div>


            <h1>Produtos Disponíveis</h1>
            
            {/* Barra de Busca com Ícone */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={search}
                    onChange={handleSearch}
                    className="search-input"
                />
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>

            {/* Spinner e Mensagens */}
            {loading ? (
                <p>Carregando produtos...</p>
            ) : (
                filteredProdutos.length === 0 ? (
                    <p>Nenhum produto encontrado.</p>
                ) : (
                    <ProductList produtos={filteredProdutos} addToShoppingList={addToShoppingList} />
                )
            )}

            {/* Adicionando a interface da Lista de Compras */}
            <ShoppingList items={items} setItems={setItems} />
            <ToastContainer />
        </div>
    );
}

export default App;
