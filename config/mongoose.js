var mongoose = require("mongoose");
// ${process.env.mongousername}:${process.env.mongopassword}
mongoose
  .connect(
    `mongodb+srv://akshatspeaking:conduitpassword@conduit-api.i43oi.mongodb.net/conduit?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then((result) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Mongo Error", err);
  });

module.exports = mongoose;
