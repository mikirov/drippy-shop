package com.example.fileshare.service;

import com.example.fileshare.exception.OrderAlreadyShippedException;
import com.example.fileshare.exception.OrderNotFoundException;
import com.example.fileshare.exception.ProductQuantityException;
import com.example.fileshare.model.Order;
import com.example.fileshare.model.OrderState;
import com.example.fileshare.model.Product;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.OrderRepository;
import com.example.fileshare.repository.ProductRepository;

public class OrderServiceImpl implements OrderService{

    private OrderRepository orderRepository;

    private ProductRepository productRepository;

    @Override
    public void addOrder(User user, Product product, Integer quantity) throws ProductQuantityException {
        if(quantity < 1 || product.getQuantity() < quantity){
            throw new ProductQuantityException();
        }
        Order order = new Order(user, product, quantity);
        this.orderRepository.save(order);
    }

    @Override
    public void deleteOrder(User user, Integer orderId) throws OrderNotFoundException, OrderAlreadyShippedException {
        Order order = orderRepository.findOrderById(orderId);
        if(order == null){
            throw new OrderNotFoundException();
        }
        if(order.getBuyer().equals(user)){
            //check if order is not yet shipped
            if(!order.getOrderState().equals(OrderState.SHIPPED)){
                this.orderRepository.delete(order);
            }
            else{
                throw new OrderAlreadyShippedException();
            }
        }
    }
}
