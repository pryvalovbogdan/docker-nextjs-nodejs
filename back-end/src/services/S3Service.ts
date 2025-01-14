import { S3, config } from 'aws-sdk';

const { BUCKET_NAME, BUCKET_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

config.update({
  region: BUCKET_REGION as string,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID as string,
    secretAccessKey: AWS_SECRET_ACCESS_KEY as string,
  },
});

class S3Service {
  private s3: S3 = new S3();

  uploadFileS3 = async (key: string, body: Buffer, contentType: string): Promise<string> => {
    try {
      const params = {
        Bucket: BUCKET_NAME as string,
        Key: key,
        Body: body,
        ContentType: contentType,
      };

      const result = await this.s3.upload(params).promise();

      console.log(`File uploaded successfully`, result);

      return result.Location;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  };

  deleteFileS3 = async (key: string): Promise<S3.DeleteObjectOutput> => {
    try {
      const params = {
        Bucket: BUCKET_NAME as string,
        Key: key,
      };

      const result = await this.s3.deleteObject(params).promise();

      console.log(`File deleted successfully`, result);

      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('File delete failed');
    }
  };

  getFileS3 = async (key: string): Promise<string> => {
    try {
      const params = {
        Bucket: BUCKET_NAME as string,
        Key: key,
        Expires: 60 * 60, // Signed URL valid for 1 hour
      };

      const result = this.s3.getSignedUrl('getObject', params);

      console.log(`File url generated successfully`, result);

      return result;
    } catch (error) {
      console.error('Error url generated file:', error);
      throw new Error('File url generated failed');
    }
  };
}

export default S3Service;
