const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/fiaptech", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000,
});

// Model Usuário
const usuarioSchema = new mongoose.Schema({
  nome: { type: String },
  email: { type: String, Required: true },
  senha: { type: String },
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

// Model Produto
const produtoSchema = new mongoose.Schema({
  codigo: { type: String, Required: true },
  descricao: { type: String },
  fornecedor: { type: String },
  data_fabricacao: { type: Date },
  quantidade_estoque: { type: Number },
});

const Produto = mongoose.model("Produto", produtoSchema);

app.post("/cadastrousuario", async (req, res) => {
  const nome = req.body.nome;
  const email = req.body.email;
  const senha = req.body.senha;

  if (nome == null || email == null || senha == null) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }
  const emailExistente = await Usuario.findOne({ email: email });
  if (emailExistente) {
    return res
      .status(400)
      .json({ error: "O e-mail digitado já foi cadastrado" });
  }

  const usuario = new Usuario({
    nome: nome,
    email: email,
    senha: senha,
  });

  try {
    const newUsuario = await usuario.save();
    res.redirect("/");
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post("/cadastroproduto", async (req, res) => {
  const codigo = req.body.codigo;
  const descricao = req.body.descricao;
  const fornecedor = req.body.fornecedor;
  const data_fabricacao = req.body.data_fabricacao;
  const quantidade_estoque = req.body.quantidade_estoque;

  const produto = new Produto({
    codigo: codigo,
    descricao: descricao,
    fornecedor: fornecedor,
    data_fabricacao: data_fabricacao,
    quantidade_estoque: quantidade_estoque,
  });

  try {
    const newProduto = await produto.save();
    res.redirect("/");
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get("/cadastrousuario", async (req, res) => {
  res.sendFile(__dirname + "/cadastrousuario.html");
});

app.get("/cadastroproduto", async (req, res) => {
  res.sendFile(__dirname + "/cadastroproduto.html");
});

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
