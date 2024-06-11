const express = require("express");
const {
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
} = require("./new");
const app = express();
app.use(express.json());
app.get("/api/users", async (req, res) => {
  const users = await fetchUsers();
  res.json(users);
});
app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await createUser(username, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/api/products", async (req, res) => {
  const products = await fetchProducts();
  res.json(products);
});
app.post("/api/products", async (req, res) => {
  const { name } = req.body;
  try {
    const product = await createProduct(name);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
app.get("/api/users/:id/favorites", async (req, res) => {
  const favorites = await fetchFavorites(req.params.id);
  res.json(favorites);
});
app.post("/api/users/:id/favorites", async (req, res) => {
  const favorite = await createFavorite(req.params.id, req.body.productId);
  res.status(201).json(favorite);
});
app.delete("/api/users/:userId/favorites/:id", async (req, res) => {
  await destroyFavorite(req.params.userId, req.params.id);
  res.status(204).send();
});
async function init() {
  await createTables();
  app.listen(3000, () => {
    console.log("Server is running on port 5000");
  });
}
init();