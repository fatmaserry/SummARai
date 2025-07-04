package com.summarai.summarai.exception;

public class UnAuthorizedOperationException extends RuntimeException {
    public UnAuthorizedOperationException(String message) {
        super(message);
    }
}
