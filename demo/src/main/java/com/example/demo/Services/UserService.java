package com.example.demo.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Model.Users;
import com.example.demo.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository ur;

    public Users findByUsernameInTransaction(String email) throws UsernameNotFoundException {
        Users user = ur.getUserByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("user not found");
        }
        return user;
    }

    @Transactional
    public void updateCurrentUserDetails(Users updatedUser) {
        ur.save(updatedUser);
    }
}
