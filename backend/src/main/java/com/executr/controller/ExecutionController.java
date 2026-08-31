package com.executr.controller;

import com.executr.dto.request.CodeExecutionRequest;
import com.executr.dto.response.CodeExecutionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
// WARNING: @CrossOrigin allows the React frontend to talk to this API. 
// For production, you should restrict this to your specific frontend URL.
@CrossOrigin(origins = "http://localhost:5173") 
public class ExecutionController {

    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(@RequestBody CodeExecutionRequest request) {
        
        System.out.println("Received request to execute " + request.getLanguage() + " code.");
        System.out.println("Source Code payload:\n" + request.getSourceCode());

        // TODO: In the next step, we will pass this to our Docker service.
        // For right now, we are just mocking a successful response to ensure the pipeline works.
        
        String simulatedOutput = "Simulated output from Spring Boot for language: " + request.getLanguage();
        String simulatedError = null; // Set to a string to test error handling on the frontend

        CodeExecutionResponse response = new CodeExecutionResponse(simulatedOutput, simulatedError);
        return ResponseEntity.ok(response);
    }
}