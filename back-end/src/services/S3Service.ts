import { CloudFront, S3, config } from 'aws-sdk';

const { BUCKET_NAME, BUCKET_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, CLOUDFRONT_DISTRIBUTION_ID } =
  process.env;

config.update({
  region: BUCKET_REGION!,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

class S3Service {
  private s3: S3 = new S3();

  private cloudFront: CloudFront = new CloudFront();

  uploadFileS3 = async (key: string, body: Buffer, contentType: string): Promise<string> => {
    try {
      const params = {
        Bucket: BUCKET_NAME!,
        Key: key,
        Body: body,
        ContentType: contentType,
      };

      console.log('params', params);
      const result = await this.s3.upload(params).promise();

      console.log(`File uploaded successfully`, result);

      return result.Location;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('File upload failed');
    }
  };

  deleteFileS3 = async (url: string): Promise<S3.DeleteObjectOutput> => {
    try {
      const key = url.replace(process.env.CLOUDFRONT_URL!, '');
      const params = {
        Bucket: BUCKET_NAME!,
        Key: key,
      };

      const result = await this.s3.deleteObject(params).promise();

      // Invalidate the CloudFront cache for the deleted file
      await this.invalidateCloudFrontCache(key);

      console.log(`File deleted successfully`, result);

      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('File delete failed');
    }
  };

  private invalidateCloudFrontCache = async (key: string): Promise<void> => {
    try {
      const paths = [`/${key}`];

      const params = {
        DistributionId: CLOUDFRONT_DISTRIBUTION_ID!,
        InvalidationBatch: {
          CallerReference: key, // to invalidate the same request
          Paths: {
            Quantity: paths.length,
            Items: paths,
          },
        },
      };

      const result = await this.cloudFront.createInvalidation(params).promise();

      console.log('CloudFront cache invalidated successfully', result);
    } catch (error) {
      console.error('Error invalidating CloudFront cache:', error);
    }
  };

  getFileS3 = async (key: string): Promise<string> => {
    try {
      const params = {
        Bucket: BUCKET_NAME!,
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
