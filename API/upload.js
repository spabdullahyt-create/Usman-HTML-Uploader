const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.BUCKET_NAME;

module.exports = async (req, res) => {
    const form = new formidable.IncomingForm();
    
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(500).send('Error in file parsing');
        }

        const file = files.htmlFile[0]; // Assuming one file is uploaded
        const filePath = file.filepath;

        const fileContent = fs.readFileSync(filePath);
        const params = {
            Bucket: BUCKET_NAME,
            Key: `uploads/${file.originalFilename}`,
            Body: fileContent,
            ContentType: 'text/html',
            ACL: 'public-read'
        };

        s3.upload(params, (err, data) => {
            if (err) {
                return res.status(500).send('Error uploading to S3');
            }

            // Return the URL of the uploaded file
            res.status(200).send({ url: data.Location });
        });
    });
};
