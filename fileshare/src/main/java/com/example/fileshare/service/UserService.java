package com.example.fileshare.service;

import com.example.fileshare.model.User;

public interface UserService {
    void save(User user);

    void enable(User user);

    User findByUsername(String username);
}