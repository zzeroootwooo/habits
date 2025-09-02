import { app } from "./app.js";

const PORT = 4000;

app.all("/_next/webpack-hmr", (req, res) => {
    nextjsRequestHandler(req, res);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
