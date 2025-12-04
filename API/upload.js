const { Blob } = require('@vercel/blob');
const formidable = require('formidable');
const fs = require('fs');

module.exports = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Form parsing error:", err);  // Log error
            return res.status(500).send('Error in file parsing');
        }

        const file = files.htmlFile[0];  // Get the uploaded file
        if (!file) {
            console.error("No file uploaded");
            return res.status(400).send('No file uploaded');
        }

        const filePath = file.filepath;
        const fileContent = fs.readFileSync(filePath);  // Read the file content

        try {
            // Upload the file to Vercel Blob
            const blob = new Blob();
            const blobUrl = await blob.put(fileContent, {
                contentType: 'text/html',
                filename: file.originalFilename,
                access: 'public',  // Make sure it's publicly accessible
            });

            // Return the permanent URL where the file is stored
            const permanentUrl = `https://usman-html-uploader.vercel.app/uploads/${file.originalFilename}`;
            res.status(200).json({ url: permanentUrl });
        } catch (err) {
            console.error("Blob upload error:", err);  // Log error
            res.status(500).send('Error uploading to Vercel Blob');
        }
    });
};
