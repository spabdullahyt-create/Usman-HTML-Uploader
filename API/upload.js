const { Blob } = require('@vercel/blob');
const formidable = require('formidable');
const fs = require('fs');  // Ensure fs is required for file handling

module.exports = async (req, res) => {
    const form = new formidable.IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).send('Error in file parsing');
        }

        const file = files.htmlFile[0]; // Get the uploaded file
        const filePath = file.filepath;
        const fileContent = fs.readFileSync(filePath); // Read the file content

        try {
            // Upload the file to Vercel Blob
            const blob = new Blob();
            const blobUrl = await blob.put(fileContent, {
                contentType: 'text/html',
                filename: file.originalFilename,
                access: 'public' // Making the file publicly accessible
            });

            // Return the URL where the file is stored
            res.status(200).json({ url: blobUrl });
        } catch (err) {
            res.status(500).send('Error uploading to Vercel Blob');
        }
    });
};

