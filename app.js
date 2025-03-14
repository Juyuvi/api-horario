const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
let local = "brasilia";
const listaLocais = {"brasilia": "America/Sao_Paulo", "greenwich": "Etc/GMT", "tokyo": "Asia/Tokyo"};

app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
    const status = {
       "Status": "Running... Nada explodiu (ainda)."
    };
    
    response.send(status);
});

app.get("/horario-atual", (request, response)=>{
    const data = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

    const requestResponse = {
        "hora": `${data.slice(-8)}`
    }

    response.send(requestResponse)
})

app.post("/alterar-local", (req, res) => {
    novoLocal = req.body.local;

    if (!(Object.keys(listaLocais).includes(novoLocal))){
        res.status(400).send({
            "error": "Local não está na lista de locais disponíveis para horário customizado.",
            "listaLocais": "Locais disponíveis: brasila, greenwich, tokyo"
        })
    }
    else{
        local = novoLocal;

        res.send({
            "localAlterado": `Local alterado com sucesso. Novo local: ${local}`
        });
    }  
});

app.get("/horario-custom", (req, res) => {
    const data = new Date().toLocaleString("pt-BR", {timeZone: listaLocais[local]});

    res.send({
        "hora": `${data.slice(-8)}`
    });
});

app.get("/help", (req, res) => {
    res.send({
        "GET /status": "status da API (se não responder, talvez tenha pego no sono)",
        "GET /horario-atual": "retorna o horário atual (brasília only)",
        "POST /alterar-local": "altera o local do /horario-custom. Opções: brasília, greenwich e tokyo",
        "GET /hoario-custom": "retorna o horário do lugar customizado"
    });
});