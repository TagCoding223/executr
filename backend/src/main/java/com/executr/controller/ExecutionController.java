package com.executr.controller;

import com.executr.dto.request.CodeExecutionRequest;
import com.executr.dto.response.CodeExecutionResponse;
import com.executr.service.DockerExecutionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
// WARNING: @CrossOrigin allows the React frontend to talk to this API. 
// For production, you should restrict this to your specific frontend URL.
@CrossOrigin(origins = "http://localhost:5173") 
public class ExecutionController {

    private final DockerExecutionService executionService;

    // Spring Boot automatically injects the service via constructor
    public ExecutionController(DockerExecutionService executionService) {
        this.executionService = executionService;
    }

    @PostMapping("/execute")
    public ResponseEntity<CodeExecutionResponse> executeCode(@RequestBody CodeExecutionRequest request) {
        
        String result;
        String error = null;

        if ("java".equalsIgnoreCase(request.getLanguage())) {
            result = executionService.executeJavaCode(request.getSourceCode());
            // Basic logic to separate errors from standard output for the frontend
            if (result.startsWith("Error:")) {
                error = result;
                result = null;
            }
        } else {
            error = "Error: " + request.getLanguage() + " execution is not yet implemented.";
            result = null;
        }

        return ResponseEntity.ok(new CodeExecutionResponse(result, error));
    }
}