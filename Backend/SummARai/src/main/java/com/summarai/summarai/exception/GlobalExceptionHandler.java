package com.summarai.summarai.exception;

import com.amazonaws.services.kms.model.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1) Tell Spring you want to handle ReadingNotFoundException…
    @ExceptionHandler(ReadingNotFoundException.class)
    // 2) …and accept exactly that type as the method parameter
    public ResponseEntity<Map<String,String>> handleReadingNotFound(ReadingNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(DuplicateRecordException.class)
    public ResponseEntity<Map<String, String>> handleDuplicateRecord(DuplicateRecordException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }


}