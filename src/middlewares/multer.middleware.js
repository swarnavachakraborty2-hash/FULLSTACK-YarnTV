const multer = require('multer')


//configure disk where file to be uploaded 
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, './public/temp')//stores all the uploaded files in the public/temp file (files should be accessed from that path)
  },
  
  filename: function (req, file, cb) {
    cb(null, file.originalname) //saves the files by their original name
  }
})


const upload = multer({storage: storage})
//const upload = multer({storage: multer.memoryStorage()}) ** large files cannot be stored in memory **


module.exports = upload