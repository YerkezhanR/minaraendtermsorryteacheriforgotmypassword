const http = require("http");
const path = require("path");
const fs = require("fs");
const port = 3000;

http
	.createServer(function (req, res) {
		let reqUrl = req.url.toLowerCase();
		let urlExt = path.extname(reqUrl);
		let fileDir;
		console.log(reqUrl);
		const mimeTypes = {
			".ico": "image/x-icon",
			".html": "text/html",
			".js": "text/javascript",
			".json": "application/json",
			".css": "text/css",
			".png": "image/png",
			".jpg": "image/jpeg",
			".mp4": "video/mp4",
		};

		if (urlExt === ".mp4") {
			const splitted = reqUrl.split("/");
			if (splitted.length > 3 && splitted[3]) {
				fileDir = "error";
			} else
				fileDir = path.join(__dirname, splitted[1], "students", splitted[2]);
		} else if (reqUrl === "/") {
			fileDir = path.join(__dirname, "index.html");
			urlExt = ".html";
		} else if (reqUrl === "/about") {
			fileDir = path.join(__dirname, "about.html");
			urlExt = ".html";
		} else {
			fileDir = path.join(__dirname, reqUrl);
		}

		let contentType = mimeTypes[urlExt] || "text/plain";

		fs.readFile(fileDir, function (error, data) {
			if (error) {
				fs.readFile(path.join(__dirname, "error.html"), (err, content) => {
					if (err) {
						res.writeHead(500);
						res.end("500 - Internal error with a response code 500");
					} else {
						res.writeHead(404, {
							"Content-Type": "text/html",
						});
						res.write(content);
					}
				});
			} else {
				res.writeHead(200, {
					"Content-Type": contentType,
				});
				res.end(data);
			}
		});
	})
	.listen(port, () => console.log(`Server has been started on port ${port}`));
