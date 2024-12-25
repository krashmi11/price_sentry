package com.example.demo.Controller;

import java.time.LocalDateTime;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.ProductTrack;
import com.example.demo.Model.Products;
import com.example.demo.Model.Users;
import com.example.demo.Repository.ProductRepository;
import com.example.demo.Repository.ProductTrackRepository;
import com.example.demo.Repository.UserRepository;
// import java.security.Principal;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ProductController {
    @Autowired
    private ProductRepository productrepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductTrackRepository productTrack;

    @PostMapping("/api/products")
    public ResponseEntity<Map<String, Object>> getProduct(@RequestBody Map<String, Object> productMap) {
        Map<String, Object> response = new HashMap<>();
        try {
            Users user = userRepo.getUserByEmail((String) (productMap.get("username")));
            Products product = new Products();
            product.setProductLink((String) (productMap.get("productLink")));
            product.setPrice((Double) (productMap.get("price")));
            product.setThreshold((int) (productMap.get("threshold")));
            product.setTitle((String) (productMap.get("product_title")));
            product.setUser(user);
            productrepo.save(product);
            response.put("message", "Saved Successfully...");
            response.put("id", product.getPid());

        } catch (Exception e) {
            return ResponseEntity.status(400).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/api/productDashboard")
    public ResponseEntity<List<Products>> productDashBoard(@RequestBody Map<String, Object> map) {
        String username = (String) map.get("username");
        Users user = userRepo.getUserByEmail(username);
        List<Products> productsList = productrepo.findByUserUid(user.getUid());

        // Print each product link in the server console
        for (Products pro : productsList) {
            System.out.println(pro.getProductLink());
        }
        System.out.println("saved successfully");
        // Return the list of products as JSON response
        return ResponseEntity.ok(productsList);
    }

    @DeleteMapping("/api/delete/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable("id") int pid) {
        try {
            Optional<Products> product = productrepo.findById(pid);
            if (product.isPresent()) {
                productrepo.delete(product.get());
                List<ProductTrack> lis = productTrack.findByProductPid(pid);
                for (ProductTrack pt : lis) {
                    productTrack.delete(pt);
                }
                return ResponseEntity.ok("Product deleted successfully");
            } else {
                return ResponseEntity.ok("Product Not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error");
        }
    }

    @PostMapping("/api/track-products/{id}")
    public ResponseEntity<String> storeTrackData(@RequestBody Map<String, Object> map, @PathVariable("id") int pid) {
        try {
            ProductTrack ptrack = new ProductTrack();
            String link = (String) map.get("productLink");
            ptrack.setPlink(link);
            ptrack.setPrice((Double) map.get("price"));
            ptrack.setCurrentDateTime(LocalDateTime.now());

            Optional<Products> product = productrepo.findById(pid);
            if (product.isPresent()) {
                ptrack.setProduct(product.get());
                productTrack.save(ptrack);
                return ResponseEntity.status(200).body("Successfully entered tracked Record");
            } else {
                return ResponseEntity.status(404).body("Product Not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error");
        }
    }

    @GetMapping("/api/get-track-record/{productId}")
    public ResponseEntity<List<ProductTrack>> getTrackRecords(@PathVariable("productId") int pid) {
        try {
            List<ProductTrack> trackList = productTrack.findByProductPid(pid);
            for (ProductTrack pt : trackList) {
                System.out.println(pt.getTrackid());
            }
            return ResponseEntity.ok(trackList);
        } catch (Exception exception) {
            return ResponseEntity.status(400).body(null);
        }
    }

}
