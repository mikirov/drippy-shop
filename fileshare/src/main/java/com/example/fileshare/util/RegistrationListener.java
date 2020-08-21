package com.example.fileshare.util;

import com.example.fileshare.model.User;
import com.example.fileshare.service.UserService;
import com.example.fileshare.service.VerificationTokenService;
import org.springframework.context.ApplicationListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class RegistrationListener implements
        ApplicationListener<OnRegistrationCompleteEvent> {

    private final VerificationTokenService service;

    private final JavaMailSender mailSender;

    public RegistrationListener(VerificationTokenService service, JavaMailSender mailSender) {
        this.service = service;
        this.mailSender = mailSender;
    }

    @Override
    public void onApplicationEvent(OnRegistrationCompleteEvent event) {
        this.confirmRegistration(event);
    }

    private void confirmRegistration(OnRegistrationCompleteEvent event) {
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        service.createVerificationToken(user, token);

        String recipientAddress = user.getUsername();
        String confirmationUrl
                = event.getAppUrl() + "/registrationConfirm?token=" + token;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject("Registration Confirmation");
        email.setText("Finish registration\r\nhttp://localhost:8080" + confirmationUrl);
        mailSender.send(email);
    }
}