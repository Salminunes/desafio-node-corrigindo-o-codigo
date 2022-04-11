const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params; // peguei por parametro o id do repositorio a ser alterado
  const { title, techs, url } = request.body; //os valores que vao ser alterados passado pelo body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id); //Aqui crio uma constante que ache o index do repositorio que tenha o id igual ao id do parametro

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" }); //se retornar -1 avisa que não foi achado repositorio com esse id.
  }

  const repository = { ...repositories[repositoryIndex], title, techs, url }; //Pega o objeto do index

  repositories[repositoryIndex] = repository; //dentro do array de repositorios, no local do index, coloco o repositorio alterado!

  return response.json(repository); //retorna o repositorio alterado
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = repositories[repositoryIndex]

  repository.likes++

  return response.json(repository);
});

module.exports = app;
