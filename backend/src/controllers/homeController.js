import path from "path";

const showHomeHTML = (req, res) => {
    res.sendFile(path.resolve("public/html/home.html"))
}

export { showHomeHTML };