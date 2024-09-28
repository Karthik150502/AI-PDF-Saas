const AWS = require('aws-sdk');
async function deleteDoc(fileKey) {

    AWS.config.update({
        accessKeyId: "AKIAX5ZI6C2LAGGLAUDE",
        secretAccessKey: "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",
    })
    try {

        const s3 = new AWS.S3({
            params: {
                Bucket: "pdf-ai-chat-karthikj"
            },
            region: 'eu-north-1'
        })


        let params = {
            Bucket: "pdf-ai-chat-karthikj",
            Key: fileKey,
        };


        // let res = await s3.deleteObject(params)
        s3.deleteObject(params, (err, data) => {
            if (err) console.log(err, err.stack); // an error occurred
            else console.log(data);           // successful response
        });



    } catch (e) {
        console.log(e)
    }
}

deleteDoc("1727441179708Karthik-J-15052002.pdf");

