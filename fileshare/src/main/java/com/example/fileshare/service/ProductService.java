package com.example.fileshare.service;

import com.example.fileshare.model.Category;
import com.example.fileshare.model.Product;
import com.example.fileshare.model.SubCategory;
import com.example.fileshare.model.User;

import java.util.List;

public interface ProductService {

    void save(User user, String name, Category category, float price, List<String> images);

    void delete(User user, int id);

    void updateName(User user, int id, String newName);

    void updatePrice(User user, int id, float newPrice);

    void updateCategory(User user, int id, Category newCategory);

    List<Product> findAllProducts();

    List<Product> findProductsByCategory(Category category);

    List<Product> findProductsByCategoryAndSubCategory(Category category, SubCategory subCategory);

    Integer countProductsByCategory(Category category);

    Product findProductById(int id);

}
