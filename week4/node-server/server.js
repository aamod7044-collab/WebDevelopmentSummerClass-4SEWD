const http = require("http");
const PORT = 3000;

const server = http.createServer((req, res) => {
  // Route handling will go here
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to my Node.js Server!");
  } else if (req.url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
    <h1>About This Server</h1>
    <p>This is my first Node.js web server, built without any external frameworks.</p>
    <p>Created by: Your Name</p>
  `);
  } else if (req.url === "/api/student") {
    const student = {
      name: "John",
      course: "Web Development",
      semester: 5,
    };
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(student));
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 - Page Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
