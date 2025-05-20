package com.summarai.summarai.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService implements EmailSender{
    private final static Logger LOGGER = LoggerFactory.getLogger(EmailService.class);
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void send(String to, String email) {
        try{
            //used to create and manipulate email messages in java, it is a standard mail message (Multipurpose Internet Mail Extensions)
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage,"utf-8");
            messageHelper.setText(email,true);
            messageHelper.setTo(to);
            messageHelper.setSubject("Confirm your email");
            // email: summaraiservice@gmail.com, password: summARai_0.1
            messageHelper.setFrom("summaraiservice@gmail.com");
            mailSender.send(mimeMessage);
        } catch (MessagingException e){
            LOGGER.error("failed to send email",e);
            throw new IllegalStateException("failed to send email");
        }
    }

}
