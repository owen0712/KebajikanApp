const fs = require('fs')
const path = require('path')

const getAvatarImage = () => {
    const image = path.join(__dirname, '../assets/avatar.png');
    const file = fs.readFileSync(image, {encoding: 'base64'});
    return "data:image/png;base64,"+file;
}

const getUMLogo = () => {
    const image = path.join(__dirname, '../assets/universiti_malaya_logo.png');
    const file = fs.readFileSync(image, {encoding: 'base64'});
    return "data:image/png;base64,"+file;
}

module.exports = {getAvatarImage,getUMLogo};
