package com.example.fileshare.service;

import com.example.fileshare.exception.OrderAlreadyShippedException;
import com.example.fileshare.exception.OrderNotFoundException;
import com.example.fileshare.exception.ProductQuantityException;
import com.example.fileshare.model.Product;
import com.example.fileshare.model.User;

public interface OrderService {

    void addOrder(User user, Product product, Integer quantity) throws ProductQuantityException;

    void deleteOrder(User user, Integer orderId) throws OrderNotFoundException, OrderAlreadyShippedException;
}
