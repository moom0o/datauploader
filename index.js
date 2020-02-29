const fs = require("fs")
fs.readdir("./data", function(err, filenames) {
    let uuid = bot.players[username].uuid
    var request = require("request")
    var fs = require('fs');
    var archiver = require('archiver');
    var output = fs.createWriteStream(`./datapackage/${uuid}.zip`);
    var archive = archiver('zip', {
        gzip: true,
        zlib: {
            level: 9
        }
    });
    archive.on('error', function(err) {
        throw err;
    });
    archive.pipe(output);
    filenames.forEach(function(filename) {
        if (fs.existsSync(`./data/${filename}/${uuid}.json`)) {
            archive.file(`./data/${filename}/${uuid}.json`, {
                name: `${filename}.json`
            });
        }
    })
    archive.finalize();
    setTimeout(() => {
        var req = request.post("https://file.io/", function(err, resp, body) {
            if (err) {
                console.log('Error!');
            } else {
                console.log('URL: ' + body);
            }
        });
        var form = req.form();
        form.append('file', fs.createReadStream(`./datapackage/${uuid}.zip`));
        setTimeout(() => {
            fs.unlink(`./datapackage/${uuid}.zip`, (err) => {
                if (err) throw err;
              });
        }, 1000)
    }, 1000)
})
