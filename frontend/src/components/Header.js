import React, { useState, useEffect } from "react";
import ThemeSwitcher from './ThemeSwitcher';
import marketCart from '../assets/cart.png';
import "bootstrap/dist/css/bootstrap.min.css";

const Header = ({ cartItemCount, darkMode, toggleTheme }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Atualiza o estado de isMobile ao redimensionar a janela
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg ${darkMode ? 'bg-dark navbar-dark' : 'bg-light navbar-light'}`}>
            <div className="container-fluid">
                {/* Marca ou Título */}
                <a className="navbar-brand" href="#home">Minha Loja</a>

                {/* Botão de Colapso */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu Colapsável */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#home">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#products">Produtos</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#contact">Contato</a>
                        </li>
                    </ul>

                    {/* Botão de Alternância de Tema - Apenas Dentro do Menu para Mobile */}
                    {isMobile && (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <div className="nav-link d-inline-block p-0">
                                    <ThemeSwitcher darkMode={darkMode} toggleTheme={toggleTheme} />
                                </div>
                            </li>
                        </ul>
                    )}

                    {/* Ícone do Carrinho */}
                    <div className="cart-icon position-relative ms-3">
                        <img src={marketCart} alt="Carrinho de Compras" className="img-fluid" style={{ width: '30px' }} />
                        <span
                            id="header-cart-counter"
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        >
                            {cartItemCount}
                        </span>
                    </div>

                    {/* Botão de Alternância de Tema - Apenas Fora do Menu para Desktop */}
                    {!isMobile && (
                        <div className="ms-3">
                            <ThemeSwitcher darkMode={darkMode} toggleTheme={toggleTheme} />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
