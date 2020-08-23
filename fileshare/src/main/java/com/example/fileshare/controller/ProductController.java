package com.example.fileshare.controller;


import com.example.fileshare.model.Category;
import com.example.fileshare.model.Product;
import com.example.fileshare.model.SubCategory;
import com.example.fileshare.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Controller
@CrossOrigin
public class ProductController {


    private ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/shop/{category}/{subCategory}")
    @ResponseStatus(HttpStatus.OK)
    public String getClothesByCategoryAndSubcategory(@PathVariable("category") Category category, @PathVariable("subCategory") SubCategory subCategory, Model model){

        //TODO: limit results
        List<Product> productList = this.productService.findProductsByCategoryAndSubCategory(category, subCategory);
        model.addAttribute("products",productList);
        return "shop";
    }


    @GetMapping("/shop/{category}")
    @ResponseStatus(HttpStatus.OK)
    public String getClothesByCategoryAndSubcategory(@PathVariable("category") Category category, Model model){

        //TODO: limit results
        List<Product> productList = this.productService.findProductsByCategory(category);
        model.addAttribute("products",productList);
        return "shop";
    }

    @GetMapping("/shop/{id}")
    @ResponseStatus(HttpStatus.OK)
    public String getProduct(@PathVariable("id") Integer id, Model model){

        //TODO: limit results
        Product product = this.productService.findProductById(id);
        model.addAttribute("product",product);
        return "product-details";
    }
}
