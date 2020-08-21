package com.example.fileshare.controller;


import com.example.fileshare.model.User;
import com.example.fileshare.model.VerificationToken;
import com.example.fileshare.service.SecurityService;
import com.example.fileshare.service.UserService;
import com.example.fileshare.service.VerificationTokenService;
import com.example.fileshare.util.OnRegistrationCompleteEvent;
import com.example.fileshare.util.UserValidator;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import javax.servlet.http.HttpServletRequest;
import java.util.Calendar;

@Controller
@CrossOrigin
public class UserController {
    private final UserService userService;

    private final UserValidator userValidator;

    private final ApplicationEventPublisher eventPublisher;

    private final VerificationTokenService verificationTokenService;

    public UserController(UserService userService, UserValidator userValidator, ApplicationEventPublisher eventPublisher, VerificationTokenService verificationTokenService) {
        this.userService = userService;
        this.userValidator = userValidator;
        this.eventPublisher = eventPublisher;
        this.verificationTokenService = verificationTokenService;
    }

    @GetMapping("/registration")
    public String registration(Model model) {
        model.addAttribute("userForm", new User());

        return "registration";
    }

    @PostMapping("/registration")
    public String registration(@ModelAttribute("userForm") User userForm,
                               BindingResult bindingResult,
                               HttpServletRequest request) {
        userValidator.validate(userForm, bindingResult);

        if (bindingResult.hasErrors()) {
            return "registration";
        }

        String appUrl = request.getContextPath();

        userService.save(userForm);

        eventPublisher.publishEvent(new OnRegistrationCompleteEvent(userForm, appUrl));

        return "redirect:/";
    }

    @GetMapping("/login")
    public String login(Model model, String error, String logout) {
        if (error != null)
            model.addAttribute("error", "Your username and password is invalid.");

        if (logout != null)
            model.addAttribute("message", "You have been logged out successfully.");

        return "login";
    }


    @GetMapping("/registrationConfirm")
    public String confirmRegistration
            (WebRequest request, Model model, @RequestParam("token") String token) {

        VerificationToken verificationToken = verificationTokenService.getVerificationToken(token);
        if (verificationToken == null) {
            return "redirect:/registration";
        }

        User user = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            return "redirect:/registration";
        }
        userService.enable(user);

        return "redirect:/login";
    }


}