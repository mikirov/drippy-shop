package com.example.fileshare.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;

@Controller
@CrossOrigin
public class CheckoutController {


    @GetMapping("/checkout")
    @ResponseStatus(HttpStatus.OK)
    public String getCheckout(){
        return "checkout";

    }
}
