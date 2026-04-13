import ImageKit from 'imagekit';

class ImageKitService {
    constructor() {
        this.imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
    }

    async uploadImage(file, folder = 'products') {
        try {
            const result = await this.imagekit.upload({
                file: file.buffer, // Assuming multer is used
                fileName: file.originalname,
                folder: folder
            });

            return {
                url: result.url,
                fileId: result.fileId,
                thumbnail: result.thumbnail
            };
        } catch (error) {
            console.error('ImageKit upload error:', error);
            throw new Error('Failed to upload image');
        }
    }

    async deleteImage(fileId) {
        try {
            await this.imagekit.deleteFile(fileId);
            return true;
        } catch (error) {
            console.error('ImageKit delete error:', error);
            throw new Error('Failed to delete image');
        }
    }
}

export default new ImageKitService();