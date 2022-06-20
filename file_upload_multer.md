# Express JS File Upload Multer

## Features

- Single File upload
- Multiple File Upload
- Solve File name & extesnion
- Error Handaling
- Response file

## Installation

Install the dependencies and devDependencies and start the server.

```sh
npm init -y

npm i express

npm i multer

npm i -D nodemon
```

## index.html file

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Express JS File Upload</h1>

    <form
      action="http://localhost:3000/post"
      method="post"
      enctype="multipart/form-data"
    >
      <input type="file" name="avatar" id="" />
      <input type="file" name="doc" id="" />
      <input type="submit" value="submit" />
    </form>
  </body>
</html>

```

## Development

Create a server in index.js file

```
const express = require('express')
const multer = require("multer");
const path = require("path")
const app = express()
app.use(express.json());
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

Now we have to make a folder in our directory. Here i am created a upload folder to store my all uploded file. Store a folder path into a variable.

```
const upload_folder = "./upload";
```

Create a middleware using multer function. This function take a object as parameter and return a middleware

```
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
```

#### Single File upload post method

```
app.post("/post", upload.single("avatar"), (req, res) => {
 res.send("Success");
 });

);
```

#### Multiple File upload post method

Upload.array() function two arguments:

- input file name(Example- avatar)
- number of files you want to upload (Example-2)

```
app.post("/post", upload.array("avatar", 2), (req, res) => {
   res.send("success");
 });
```

#### Multiple fields upload

When we want to upload multiple feilds like: image/pdf/doc etc then we use upload.feilds() funtion. Upload.feilds() function take array as an argument. In this array we pass multiple object. This object has different key such as name, maxCount. MaxCount means how many file we want to upload.

```
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
```

#### Error Handaling

```
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
```
