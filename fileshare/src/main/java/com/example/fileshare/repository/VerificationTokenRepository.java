package com.example.fileshare.repository;

import com.example.fileshare.model.User;
import com.example.fileshare.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VerificationTokenRepository
        extends JpaRepository<VerificationToken, Long> {

    @Query(value = "SELECT * FROM verification_token v WHERE v.token = ?1", nativeQuery = true)
    VerificationToken findByToken(String token);

}

