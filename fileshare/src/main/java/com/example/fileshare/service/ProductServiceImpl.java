package com.example.fileshare.service;

import com.example.fileshare.model.Category;
import com.example.fileshare.model.Product;
import com.example.fileshare.model.SubCategory;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void save(User user, String name, Category category, float price, List<String> images) {
        Product product = new Product(name, price, category, images, user);
        productRepository.save(product);
    }

    @Override
    public void delete(User user, int id) {
        Product product = productRepository.findProductById(id);
        if(product.getAuthor().equals(user)){
            productRepository.delete(product);
        }
    }

    @Override
    public void updateName(User user, int id, String newName) {
        Product product = productRepository.findProductById(id);
        if(product.getAuthor().equals(product)){
            product.setName(newName);
            productRepository.save(product);
        }
    }

    @Override
    public void updatePrice(User user, int id, float newPrice) {
        Product product = productRepository.findProductById(id);
        if(product.getAuthor().equals(product)){
            product.setPrice(newPrice);
            productRepository.save(product);
        }

    }

    @Override
    public void updateCategory(User user, int id, Category newCategory) {
        Product product = productRepository.findProductById(id);
        if(product.getAuthor().equals(product)){
            product.setCategory(newCategory);
            productRepository.save(product);
        }
    }

    @Override
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> findProductsByCategory(Category category) {
        return productRepository.findProductsByCategory(category);
    }

    @Override
    public List<Product> findProductsByCategoryAndSubCategory(Category category, SubCategory subCategory) {
        return productRepository.findProductsByCategoryAndSubCategory(category, subCategory);
    }

    @Override
    public Integer countProductsByCategory(Category category) {
        return productRepository.countProductsByCategory(category);
    }

    @Override
    public Product findProductById(int id) {
        return productRepository.findProductById(id);
    }
}
