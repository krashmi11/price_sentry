package com.example.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Products;

public interface ProductRepository extends JpaRepository<Products, Integer> {

    List<Products> findByUserUid(int uid);

    Products findByProductLink(String link);

}
