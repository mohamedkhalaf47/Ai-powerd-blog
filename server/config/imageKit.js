import ImageKit from "imagekit";

var imagekit = new ImageKit({
	publicKey: process.env.IMAGEKIT_PK,
	privateKey: process.env.IMAGEKIT_SK,
	urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;