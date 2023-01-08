const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const Supplier = require("./supplier");
const Client = require("./client");
const cors = require("cors");
//const multer = require("multer");

const app = express();
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: false }));

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       const isValid = FILE_TYPE_MAP[file.mimetype];
//       let uploadError = new Error('invalid image type');

//       if (isValid) {
//           uploadError = null;
//       }
//       cb(uploadError, 'public/uploads');
//   },
//   filename: function (req, file, cb) {
//       const fileName = file.originalname.split(' ').join('-');
//       const extension = FILE_TYPE_MAP[file.mimetype];
//       cb(null, `${fileName}-${Date.now()}.${extension}`);
//   }
// });

// const uploadOptions = multer({ storage: storage });

app.use(cors());
app.options('*', cors());

// app.use(
//     (req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//     );
//     next();
//   });

mongoose
  .connect(
    "mongodb+srv://tbar:PZJshudXJtqEPb3p@cluster0.n9tf0.mongodb.net/raytech"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use("/images", express.static(path.join("images")));

// 

app.get('/suppliers2', (req, res) =>{
  console.log("Started");
    const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const supplierQuery = Supplier.find();
  let fetchedSuppliers;
  if (pageSize && currentPage) {
    supplierQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  supplierQuery
    .then(documents => {
      fetchedSuppliers = documents;
      return Supplier.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Suppliers fetched successfully!",
        suppliers: fetchedSuppliers,
        maxSuppliers: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching suppliers failed!"
      });
    });
    console.log("Ended");

});

app.get('/suppliers1', (req, res) =>{
  console.log("Started");
    const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const supplierQuery = Supplier.find();
  let fetchedSuppliers;
  supplierQuery
    .then(documents => {
      fetchedSuppliers = documents;
      return Supplier.count();
    })
    .then(count => {
      res.status(200).send({
        fetchedSuppliers
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching suppliers failed!"
      });
    });
    console.log("Ended");

});

app.get(`/suppliers`, async (req, res) => {

  const supplierList = await Supplier.find()

  if (!supplierList) {
      res.status(500).json({ success: false });
  }
  res.send(supplierList);
});

app.get(`/clients`, async (req, res) => {

  const clientList = await Client.find()

  if (!clientList) {
      res.status(500).json({ success: false });
  }
  res.send(clientList);
});

app.get(`/clients/:id`, async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
      res.status(500).json({ success: false });
  }
  res.send(client);
});

app.get(`/suppliers/:id`, async (req, res) => {
  const supplier = await Supplier.findById(req.params.id);

  if (!supplier) {
      res.status(500).json({ success: false });
  }
  res.send(supplier);
});

app.post(`/suppliers`, async (req, res) => {
  // const category = await Category.findById(req.body.category);
  // if (!category) return res.status(400).send('Invalid Category');

  // const file = req.file;
  // if (!file) return res.status(400).send('No image in the request');

  // const fileName = file.filename;
  // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  let supplier = new Supplier({
      name: req.body.name,
      title: req.body.title,
      thumbnail: req.body.thumbnail,
  });

  supplier = await supplier.save();

  if (!supplier) return res.status(500).send('The supplier cannot be created');

  res.send(supplier);
});

app.post(`/clients`, async (req, res) => {
  // const category = await Category.findById(req.body.category);
  // if (!category) return res.status(400).send('Invalid Category');

  // const file = req.file;
  // if (!file) return res.status(400).send('No image in the request');

  // const fileName = file.filename;
  // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  let client = new Client({
      name: req.body.name,
      thumbnail: req.body.thumbnail,
      mobile: req.body.mobile,
      email: req.body.email,
      active: true
  });

  client = await client.save();

  if (!client) return res.status(500).send('The supplier cannot be created');

  res.send(client);
});

app.put('/clients/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Client Id');
  }
  
  const client = await Client.findById(req.params.id);
  if (!client) return res.status(400).send('Invalid Client!');

  // const file = req.file;
  // let imagepath;

  // if (file) {
  //     const fileName = file.filename;
  //     const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  //     imagepath = `${basePath}${fileName}`;
  // } else {
  //     imagepath = product.image;
  // }

  const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      {
          name: req.body.name,
          thumbnail: req.body.thumbnail,
          mobile: req.body.mobile,
          email: req.body.email,
          active: req.body.active,
      },
      { new: true }
  );

  if (!updatedClient) return res.status(500).send('the client cannot be updated!');

  res.send(updatedClient);
});

  app.put('/supplier/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Invalid Supplier Id');
    }
    
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(400).send('Invalid Supplier!');

    // const file = req.file;
    // let imagepath;

    // if (file) {
    //     const fileName = file.filename;
    //     const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    //     imagepath = `${basePath}${fileName}`;
    // } else {
    //     imagepath = product.image;
    // }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            active: req.body.active,
        },
        { new: true }
    );

    if (!updatedSupplier) return res.status(500).send('the supplier cannot be updated!');

    res.send(updatedSupplier);
});

app.delete('/clients/:id', (req, res) => {
  Client.findByIdAndRemove(req.params.id)
      .then((client) => {
          if (client) {
              return res.status(200).json({
                  success: true,
                  message: 'the client is deleted!'
              });
          } else {
              return res.status(404).json({ success: false, message: 'client not found!' });
          }
      })
      .catch((err) => {
          return res.status(500).json({ success: false, error: err });
      });
});

app.delete('/suppliers/:id', (req, res) => {
  Supplier.findByIdAndRemove(req.params.id)
      .then((supplier) => {
          if (supplier) {
              return res.status(200).json({
                  success: true,
                  message: 'the supplier is deleted!'
              });
          } else {
              return res.status(404).json({ success: false, message: 'supplier not found!' });
          }
      })
      .catch((err) => {
          return res.status(500).json({ success: false, error: err });
      });
});



module.exports = app;
