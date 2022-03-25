const server = require("./routes");

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log("'Trybe Todo List Api' running on port", PORT));
