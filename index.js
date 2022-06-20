const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
const upload_folder = "./upload";

// Define multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, upload_folder);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(fileExt, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    cb(null, fileName + fileExt);
  },
});


// upload function take a object as parameter and return a middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, //1m = 1lac
  },
  fileFilter: (req, file, cb) => {
    console.log(file);
    // Multiple feilds
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Only jpg, png, jpeg file accepted"));
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only pdf file accepted"));
      }
    }
  },
});

// single file upload
// app.post("/post", upload.single("avatar"), (req, res) => {
//   res.send("Success");
// });

// // MUltiple file upload
// app.post("/post", upload.array("avatar", 2), (req, res) => {
//   res.send("success");
// });

// MUltiple fields upload

app.post(
  "/post",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "doc", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    res.send("success");
  }
);

// Error handle

app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("There was an upload error");
    } else {
      res.status(500).send(err.message);
    }
  } else {
    res.send("SUccess");
  }
});

app.get("/", (req, res) => {
  res.send("Server is Running");
});

app.listen(3000, () => {
  console.log("Server is running in port: 30000");
});
