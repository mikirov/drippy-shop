package com.example.fileshare.controller;

import com.example.fileshare.model.Category;
import com.example.fileshare.model.Product;
import com.example.fileshare.repository.UserRepository;
import com.example.fileshare.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin
public class IndexController {

    private final ProductService productService;

    private final UserRepository userRepository;

    public IndexController(ProductService productService, UserRepository userRepository) {
        this.productService = productService;
        this.userRepository = userRepository;
    }

    @GetMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public String listAll(Model model){

        List<Product> productList = this.productService.findAllProducts();
        model.addAttribute("products",productList);

        model.addAttribute("menProductsCount", productService.countProductsByCategory(Category.MEN));
        model.addAttribute("womenProductsCount", productService.countProductsByCategory(Category.WOMEN));
        model.addAttribute("accessoriesCount", productService.countProductsByCategory(Category.ACCESSORIES));

        return "index";
    }

}
