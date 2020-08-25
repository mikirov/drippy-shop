package com.example.fileshare.controller;

import com.example.fileshare.model.Product;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.UserRepository;
import com.example.fileshare.service.LikeService;
import com.example.fileshare.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@CrossOrigin
public class LikeController {

    private LikeService likeService;

    private UserRepository userRepository;

    private ProductService productService;

    public LikeController(LikeService likeService, UserRepository userRepository, ProductService productService) {
        this.likeService = likeService;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    //TODO: if this doesn't work use RequestParam instead
    @PostMapping("/likes")
    ResponseEntity<Object> addlike(@RequestBody Map<String, Integer> body){
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        //TODO: redirect user to login page
        if(user == null){
            return ResponseEntity.notFound().build();
        }
        Product product = this.productService.findProductById(body.get("productId"));

        this.likeService.addLike(user, product);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/likes")
    Integer getLikesForUser(){
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        if(user == null){
            return 0;
        }
        return likeService.getLikesByUser(user);
    }

    @DeleteMapping("/likes")
    public ResponseEntity<Object> deleteLike(@RequestParam("productId") Integer productId){
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        if(user == null){
            return ResponseEntity.badRequest().build();
        }
        Product product = this.productService.findProductById(productId);
        if(product == null){
            ResponseEntity.notFound().build();
        }
        this.likeService.deleteLike(user, product);
        return ResponseEntity.ok().build();
    }
}
