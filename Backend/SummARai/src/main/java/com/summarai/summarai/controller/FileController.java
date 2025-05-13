package com.summarai.summarai.controller;

import com.amazonaws.services.s3.model.S3Object;
import com.summarai.summarai.service.S3Service;
import com.summarai.summarai.service.impl.S3ServiceImpl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/api/files")
public class FileController {
    private final S3Service s3Service;

    public FileController(S3ServiceImpl s3Service) {
        this.s3Service = s3Service;
    }
//    @PostMapping("/upload")
//    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
//        String fileName = s3Service.uploadFile(file);
//        return ResponseEntity.ok("File uploaded: "+fileName);
//    }
//    @GetMapping("/download/{fileName}")
//    public ResponseEntity<byte[]> DownloadFile(@PathVariable String fileName){
//        byte[] data = s3Service.downloadFile(fileName);
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
//        headers.setContentDispositionFormData("attachment",fileName);
//        return new ResponseEntity<>(data,headers, HttpStatus.OK);
//    }
    @GetMapping("/list")
    public ResponseEntity<List<String>> listBooks() {
        return ResponseEntity.ok(s3Service.getAllFiles());
    }
}
