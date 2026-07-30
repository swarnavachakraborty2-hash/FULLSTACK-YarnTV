const { v2: cloudinary } = require('cloudinary');
const fs = require('fs')// fs is used to perform file handling operations like open(), read(), write(), unlink()


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



async function uploadFile(localFile) {
    try {

        if (!localFile) return null
        const uploadResult = await cloudinary.uploader.upload(localFile, {
            resource_type: "auto"// automatically detects which type of file was uploaded 
        })
        console.log("file is uploaded to cloudinary ", uploadResult.url);
        return uploadResult

    } catch (error) {

        fs.unlink(localFile)// unlink/remove the file from the server if upload is failed to cloudinary
        console.log(error)
        return null
    }
}


module.exports = uploadFile


