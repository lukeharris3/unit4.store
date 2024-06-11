const client = new Client({
  connectionString: "postgres://postgres:password@localhost:5434/acme_store_new",
});
client.connect();
async function createTables() {
  const query = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL
    );
    CREATE TABLE favorites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      product_id UUID REFERENCES products(id),
      UNIQUE (user_id, product_id)
    );
  `;
  await client.query(query);
}
async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await client.query(
    "INSERT INTO users(username, password) VALUES($1, $2) RETURNING *",
    [username, hashedPassword]
  );
  return result.rows[0];
}
async function createProduct(name) {
  const result = await client.query(
    "INSERT INTO products(name) VALUES($1) RETURNING *",
    [name]
  );
  return result.rows[0];
}
async function fetchUsers() {
  const result = await client.query("SELECT * FROM users");
  return result.rows;
}
async function fetchProducts() {
  const result = await client.query("SELECT * FROM products");
  return result.rows;
}
async function createFavorite(userId, productId) {
  const result = await client.query(
    "INSERT INTO favorites(user_id, product_id) VALUES($1, $2) RETURNING *",
    [userId, productId]
  );
  return result.rows[0];
}
async function fetchFavorites(userId) {
  const result = await client.query(
    "SELECT products.* FROM favorites JOIN products ON favorites.product_id = products.id WHERE favorites.user_id = $1",
    [userId]
  );
  return result.rows;
}
async function destroyFavorite(userId, productId) {
  await client.query(
    "DELETE FROM favorites WHERE user_id = $1 AND product_id = $2",
    [userId, productId]
  );
}
module.exports = {
  client,
  createTables,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  createFavorite,
  fetchFavorites,
  destroyFavorite,
};