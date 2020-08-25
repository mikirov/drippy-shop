package com.example.fileshare.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.Set;

@Entity
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private User buyer;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Product product;

    @Column
    private Integer quantity;
    //TODO: map list of products to list of quantities

    private OrderState orderState = OrderState.PLACED;

    public Order(User buyer, Product product, Integer quantity) {
        this.buyer = buyer;
        this.product = product;
        this.quantity = quantity;
    }

    public User getBuyer() {
        return buyer;
    }

    public Product getProduct() {
        return product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public OrderState getOrderState() {
        return orderState;
    }

    public void setOrderState(OrderState orderState) {
        this.orderState = orderState;
    }
}
