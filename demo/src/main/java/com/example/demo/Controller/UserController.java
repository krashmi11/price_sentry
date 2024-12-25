package com.example.demo.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.example.demo.Model.Users;
import com.example.demo.Repository.UserRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userrepo;

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @PostMapping("/processProductData")
    public ResponseEntity<Map<String, Object>> productData(@RequestBody Map<String, Object> productData) {
        try {
            Users user = userrepo.getUserByEmail((String) productData.get("username"));
            if (user != null) {
                user.setPlink((String) productData.get("productLink"));
                user.setThreshold((Integer) productData.get("threshold"));
                userrepo.save(user);
                Map<String, Object> response = Map.of(
                        "message", "Product Data entered successfully!",
                        "mobile", user.getMobile() // Assuming getMobile() method exists in Users class
                );

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }
        } catch (Exception e) {
            logger.error("Error entering Product Data", e);
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

}
