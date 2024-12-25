package com.example.demo.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Model.Reviews;
import com.example.demo.Model.Users;
import com.example.demo.Repository.ReviewsRepository;
import com.example.demo.Repository.UserRepository;

import java.util.Map;
import java.util.Optional;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ReviewController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ReviewsRepository reviewsRepo;

    @PostMapping("/api/store-reviews")
    public ResponseEntity<String> storeReviews(@RequestBody Map<String, Object> reviewsMap) {
        try {
            Reviews review = new Reviews();
            String username = (String) reviewsMap.get("username");
            review.setTitle((String) reviewsMap.get("product_title"));
            review.setPlink((String) reviewsMap.get("productLink"));
            review.setReview((String) reviewsMap.get("review_summary"));
            Users user = userRepo.getUserByEmail(username);
            review.setUser(user);
            reviewsRepo.save(review);
            return ResponseEntity.ok("Reviews stored successfully..");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error storing reviews");
        }

    }

    @PostMapping("/api/getAllreviews")
    public ResponseEntity<List<Reviews>> getAllreviews(@RequestBody Map<String, Object> map) {
        try {
            String username = (String) map.get("username");
            Users user = userRepo.getUserByEmail(username);
            List<Reviews> reviewLis = reviewsRepo.findByUserUid(user.getUid());
            return ResponseEntity.ok(reviewLis);
        } catch (Exception e) {
            return ResponseEntity.ok(null);
        }
    }

    @DeleteMapping("/api/delete-review/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable("reviewId") int rid) {
        try {
            Optional<Reviews> review = reviewsRepo.findById(rid);
            if (review.isPresent()) {
                reviewsRepo.delete(review.get());
                return ResponseEntity.ok("Review deleted");
            } else {
                return ResponseEntity.ok("Product Not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error");
        }
    }
}
