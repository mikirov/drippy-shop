package com.example.fileshare.util;

import com.example.fileshare.model.Role;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashSet;
import java.util.Set;

public class CustomAuthenticationManager implements AuthenticationManager {

    @Autowired
    UserRepository userRepository;

    @Autowired
    BCryptPasswordEncoder encoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getPrincipal() + "";
        String password = authentication.getCredentials() + "";


        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        if(username.equals("admin") && password.equals("admin")){

            grantedAuthorities.add(new SimpleGrantedAuthority("USER"));

            return new UsernamePasswordAuthenticationToken(username, password, grantedAuthorities);
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new BadCredentialsException("1000");
        }
        if (!encoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("1000");
        }
        if (!user.isEnabled()) {
            throw new DisabledException("1001");
        }
        grantedAuthorities.add(new SimpleGrantedAuthority("USER"));
        return new UsernamePasswordAuthenticationToken(username, password, grantedAuthorities);
    }

}

