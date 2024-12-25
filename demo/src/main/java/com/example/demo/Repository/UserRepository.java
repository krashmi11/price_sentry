package com.example.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.Model.Users;

public interface UserRepository extends JpaRepository<Users, Integer> {
    public Users getUserByEmail(String email);

    public Users findByUid(int uid);
}
