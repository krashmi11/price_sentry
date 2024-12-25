package com.example.demo.Controller;

import java.security.Principal;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Users;
import com.example.demo.Repository.UserRepository;

import org.springframework.web.bind.annotation.PostMapping;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HomeController {

    @Autowired
    private UserRepository userrepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    // @Autowired
    // private LoginService loginService;

    @Autowired
    private BCryptPasswordEncoder bEncoder;

    private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, Object> registrationData) {
        try {
            logger.info("Registering user: " + registrationData.values().toString());
            Users user = new Users();
            String password = (String) registrationData.get("password");
            user.setUname((String) registrationData.get("name"));
            user.setEmail((String) registrationData.get("email"));
            user.setPassword(bEncoder.encode(password));
            user.setMobile((String) registrationData.get("phone"));
            user.setPlink((String) registrationData.get("productLink"));
            user.setThreshold((Integer) registrationData.get("threshold"));
            user.setRole("ROLE_USER");
            user.setEnabled(true);
            userrepo.save(user);
            return ResponseEntity.ok("User registerd successfully!");

        } catch (Exception e) {
            logger.error("Error registering user", e);
            return ResponseEntity.status(500).body("Error registering user: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> Login(@RequestBody Map<String, Object> formData) {
        try {
            String username = (String) formData.get("username");
            String password = (String) formData.get("password");
            // boolean isValidUser = loginService.validateUser(username, password);
            // Create authentication token
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username,
                    password);

            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // Verify the current authenticated user
            String currentPrincipalName = authentication.getName();
            System.out.println("^^^^^^^^" + currentPrincipalName);

            // if (isValidUser) {
            // return ResponseEntity.ok("Login successful");
            // } else {
            // return ResponseEntity.status(401).body("Invalid username or password");
            // }
            return ResponseEntity.ok("Login successful");

        } catch (Exception e) {
            logger.error("Error logging in user", e);
            return ResponseEntity.status(500).body("Error in Login:" + e.getMessage());
        }
    }

    @GetMapping("/checkAuth")
    public ResponseEntity<String> checkAuth(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }
        return ResponseEntity.ok("Authenticated as: " + principal.getName());
    }

    @GetMapping("/logout")
    public String logout() {
        return "You have been logged out.";
    }

}
