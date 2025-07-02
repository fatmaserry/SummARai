package com.summarai.summarai.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.service.BookSummaryService;
import com.summarai.summarai.service.S3Service;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.yaml.snakeyaml.util.Tuple;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class S3ServiceImpl implements S3Service {
    private final AmazonS3 s3Client;
    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public S3ServiceImpl(AmazonS3 s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadFile(MultipartFile file) throws IOException {
        try{
            File convertedFile = convertMultiPartToFile(file);
            String fileName = System.currentTimeMillis()+"_"+file.getOriginalFilename();
            s3Client.putObject(new PutObjectRequest(bucketName,fileName,convertedFile));
            convertedFile.delete();
            return fileName;
        } catch (IOException e){
            throw new RuntimeException("Upload failed"+ e.getMessage());
        }
    }
    public Tuple<String,Integer> uploadFile(byte[] fileBytes, String originalFilename) {
        try {
            String folderName = "summary";
            String workingDir = System.getProperty("user.dir");
            File customDir = new File(workingDir, folderName);
            File tempFile = File.createTempFile(
                    "summary-", "-" + originalFilename,
                    customDir);
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(fileBytes);
            }
            int pageCount;
            try (PDDocument document = PDDocument.load(tempFile)) {
                pageCount =  document.getNumberOfPages();
            }

            String fileName = System.currentTimeMillis() + "_" + originalFilename;
            s3Client.putObject(new PutObjectRequest(bucketName, fileName, tempFile));
            tempFile.delete();
            return new Tuple<String,Integer>(fileName,pageCount);
        } catch (IOException e) {
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }
    @Override
    public byte[] downloadFile(String fileName) {
        S3Object s3Object = s3Client.getObject(bucketName,fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        try {
            return inputStream.readAllBytes();
        }catch (IOException e){
            throw new RuntimeException("Download failed"+ e.getMessage());
        }
    }

    @Override
    public List<String> getAllFiles() {
        ListObjectsV2Result result = s3Client.listObjectsV2(bucketName);
        List<S3ObjectSummary> objects = result.getObjectSummaries();
        List<String> fileNames = new ArrayList<>();
        for(S3ObjectSummary object: objects){
            fileNames.add(object.getKey());
        }
        return fileNames;
    }

    @Override
    public File convertMultiPartToFile(MultipartFile file) throws IOException {
        File convertedFile = new File(file.getOriginalFilename());
        FileOutputStream fos = new FileOutputStream(convertedFile);
        fos.write(file.getBytes());
        fos.close();
        return convertedFile;
    }
    @Override
    public void deleteFile(String fileName){
        s3Client.deleteObject(bucketName,fileName);
    }
}
