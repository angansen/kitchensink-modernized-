package org.jboss.as.quickstarts.kitchensink.apigateway.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {
    
    private static final Logger logger = LoggerFactory.getLogger(FallbackController.class);

    @GetMapping("/member-service")
    public Mono<ResponseEntity<Map<String, String>>> memberServiceFallback() {
        logger.warn("Fallback triggered for member-service");
        
        Map<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Member Service is currently unavailable. Please try again later.");
        
        return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response));
    }
}
