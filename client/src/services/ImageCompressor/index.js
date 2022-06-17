export const compressImage = (imageObject, imageQuality, outputWidth, outputHeight, retry=5, imageType = "image/jpeg") => {
    console.log('imageObject:',imageObject);
    return new Promise((resolve, reject) => {
        let quality = imageQuality ? imageQuality : compressionQualityDeterminator(imageObject.base64);

        if (!(typeof imageObject.base64 === "string"))
            reject('Incorrect Image Object'); //correct image object should be {base64:xxxxxx, file:File, name:'abc.jpg', size:123, type:'image/jpg' }

        let image = new Image();
        image.src = imageObject.base64;

         image.onload = () => {
            let canvas = document.createElement("canvas");
            canvas.width = outputWidth || image.width;
            canvas.height = outputHeight || image.height;
            let canvasContext = canvas.getContext("2d");
            canvasContext.drawImage(image, 0, 0, canvas.width, canvas.height);

            let compressedBase64 = canvas.toDataURL(imageType, quality);
            console.log('compressedBase64:',compressedBase64.length)
            let qualityAfterCompressed = compressionQualityDeterminator(compressedBase64)
            console.log('qualityAfterCompressed:',qualityAfterCompressed)
            console.log('retry:',retry);
            //recursively call compressImage if not pass in imageQuality parameters and not fullfill compressionQualityDeterminator
            if (!imageQuality && !(qualityAfterCompressed >= 1.0) && retry > 0) {
                compressImage({ ...imageObject, base64: compressedBase64 }, imageQuality, outputWidth, outputHeight, --retry, imageType)
                    .then((nextCompressedBase64) => { resolve(nextCompressedBase64) })
            }else{
                resolve(compressedBase64);
            }
        }
    })
}

export const compressionQualityDeterminator = (base64) => {
    //convert canvas to base64 will increase file size tp 1.37 times, the quality return must be less than 0.5 if want to recursively reduce image size;
    if (base64.length > 10000000)//10.0MB
        return 0.1;
    if (base64.length > 5000000)//5.0MB
        return 0.2;
    if (base64.length > 3000000)//3.0MB
        return 0.3;
    if (base64.length > 2000000)//2.0MB
        return 0.4;
    if (base64.length > 1000000)//1.0MB
         return 0.5;
    return 1.0;
}