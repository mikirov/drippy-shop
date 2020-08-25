package com.example.fileshare.service;

import com.example.fileshare.model.Like;
import com.example.fileshare.model.Product;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.LikeRepository;
import org.springframework.stereotype.Service;

@Service
public class LikeServiceImpl implements LikeService {

    private LikeRepository likeRepository;

    public LikeServiceImpl(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }


    @Override
    public void addLike(User user, Product product) {
        Like like = new Like(user, product);
        this.likeRepository.save(like);
    }

    @Override
    public void deleteLike(User user, Product product) {

    }

    @Override
    public Integer getLikesByUser(User user) {
        return likeRepository.countLikesByUser(user);
    }

    @Override
    public Integer getLikesByProduct(Product product) {
        return likeRepository.countLikesByProduct(product);
    }
}
