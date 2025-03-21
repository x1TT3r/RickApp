import React, {useRef} from 'react';

function ProductList({ produtos, addToShoppingList }) {
    const buttonRefs = useRef([]);
    return (
        <div>
            <h2>Produtos Disponíveis</h2>
            <ul>
                {produtos.map((produto, index) => (
                    <li key={index}>
                        <p><strong>{produto.product_name || "Nome não disponível"}</strong></p>
                        <p>Marca: {produto.brands || "Não informado"}</p>
                        <p>Categoria: {produto.categories || "Sem categoria"}</p>
                        <button 
                            ref={(el) => (buttonRefs.current[index] = el)} // Armazena o botão no array de refs
                            className="addListItem" 
                            onClick={(e) => addToShoppingList(e, produto, buttonRefs.current[index])}
                        >
                            Adicionar à Lista
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}



/*function ProductList({ produtos, addToShoppingList }) {
    return (
        <ul style={{margin: "20px"}}>
            {produtos.map(produto => (
                <li key={produto.id}>
                    {produto.nome} - R$ {produto.preco.toFixed(2)}{" "}
                    <button onClick={() => addToShoppingList(produto)}>Adicionar à Lista</button>
                </li>
            ))}
        </ul>
    );
}*/

export default ProductList;
