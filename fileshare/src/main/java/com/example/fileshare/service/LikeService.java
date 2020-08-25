package com.example.fileshare.service;

import com.example.fileshare.model.Product;
import com.example.fileshare.model.User;

public interface LikeService {

    void addLike(User user, Product product);

    void deleteLike(User user, Product product);

    Integer getLikesByUser(User user);

    Integer getLikesByProduct(Product product);


}
