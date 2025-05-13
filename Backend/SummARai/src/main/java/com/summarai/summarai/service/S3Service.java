package com.summarai.summarai.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

public interface S3Service {
    public String uploadFile(MultipartFile file) throws IOException;
    public byte[] downloadFile(String fileName);
    public List<String> getAllFiles();
    public File convertMultiPartToFile(MultipartFile file) throws IOException;
    public void deleteFile(String fileName);
}
