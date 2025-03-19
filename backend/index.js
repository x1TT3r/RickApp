var express = require('express');
var cors = require('cors');
var axios = require('axios'); // add para api
var produtosRoutes = require('./routes/produtos');
var shoppingListRoutes = require('./routes/shoppingList');

var app = express();
app.use(cors());
app.use(express.json()); // Middleware para interpretar JSON
app.use('/produtos', produtosRoutes);
app.use('/shopping-list', shoppingListRoutes);

// Nova rota para buscar dados da Open Food Facts
app.get('/api/external-products', async (req, res) => {
    const { search_terms = "chocolate" } = req.query; // Busca por padrão "chocolate" caso nenhum termo seja informado
    try {
        const response = await axios.get("https://world.openfoodfacts.org/cgi/search.pl", {
            params: {
                search_terms: search_terms,
                search_simple: 1,
                json: 1,
                lc: "pt" //Adiciona o idioma português
            }
        });
        res.json(response.data.products); // Envia os produtos recebidos da API externa
    } catch (error) {
        console.error("Erro ao acessar a API externa:", error.message);
        res.status(500).send("Erro ao buscar os dados externos");
    }
});

const axiosInstance = axios.create({
    timeout: 10000, // Tempo limite de 10 segundos
    headers: {
        "User-Agent": "MeuApp/1.0 (seuemail@dominio.com)"
    }
});

//Rota para consumir o Nominatin(openstreetmap)
app.get("/api/nearby-supermarkets", async (req, res) => {
    const { lat, lon, radius } = req.query;

    if (!lat || !lon || !radius) {
        return res.status(400).send("Parâmetros inválidos. Por favor, envie latitude, longitude e raio.");
    }

    // Converter raio de metros para graus aproximados
    const radiusInDegrees = radius / 111000; // 111 km por grau
    const minLat = parseFloat(lat) - radiusInDegrees;
    const maxLat = parseFloat(lat) + radiusInDegrees;
    const minLon = parseFloat(lon) - radiusInDegrees / Math.cos(parseFloat(lat) * (Math.PI / 180));
    const maxLon = parseFloat(lon) + radiusInDegrees / Math.cos(parseFloat(lat) * (Math.PI / 180));

    try {
        const response = await axiosInstance.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: "supermarket",
                format: "json",
                bounded: 1,
                viewbox: `${minLon},${minLat},${maxLon},${maxLat}`,
                addressdetails: 1, // Inclui mais detalhes no retorno
                countrycodes: "BR", // Restringe os resultados ao Brasil
            },
            headers: {
                "User-Agent": "MeuApp/1.0 (seuemail@dominio.com)"
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Erro ao buscar supermercados:", error.message);
        res.status(500).send("Erro ao buscar supermercados externos.");
    }
});



var PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
