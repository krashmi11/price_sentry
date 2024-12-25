package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.ProductTrack;

import java.util.List;

public interface ProductTrackRepository extends JpaRepository<ProductTrack, Integer> {
    List<ProductTrack> findByProductPid(int pid);
}
