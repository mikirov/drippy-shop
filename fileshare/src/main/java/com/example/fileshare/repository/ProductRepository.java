package com.example.fileshare.repository;

import com.example.fileshare.model.Category;
import com.example.fileshare.model.Product;
import com.example.fileshare.model.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    Product findProductById(Integer id);

    List<Product> findProductsByCategory(Category category);


    List<Product> findProductsByCategoryAndSubCategory(Category category, SubCategory subCategory);


    Integer countProductsByCategory(Category category);
}
