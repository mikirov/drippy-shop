package com.example.fileshare.repository;

import com.example.fileshare.model.Like;
import com.example.fileshare.model.Product;
import com.example.fileshare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Integer> {

    Integer countLikesByProduct(Product product);

    Integer countLikesByUser(User user);
}
