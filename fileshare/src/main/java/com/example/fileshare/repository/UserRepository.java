package com.example.fileshare.repository;


import com.example.fileshare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT * FROM user u WHERE u.username = ?1", nativeQuery = true)
    User findByUsername(String username);

    User findByEmail(String email);

}