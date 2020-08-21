package com.example.fileshare.service;

import com.example.fileshare.model.User;
import com.example.fileshare.model.VerificationToken;

public interface VerificationTokenService {
    void createVerificationToken(User user, String token);

    VerificationToken getVerificationToken(String VerificationToken);
}
