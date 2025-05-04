package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.model.Role;
import com.summarai.summarai.model.User;
import org.mapstruct.Mapper;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class UserDetailsMapper {
    public UserDetails userToUserDetails(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User must not be null");
        }

        Set<GrantedAuthority> authoritySet = new HashSet<>();
        switch (user.getRole()) {
            case ADMIN:
                authoritySet.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                break;
            case USER:
                authoritySet.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            default:
                throw new IllegalStateException("Unknown role: " + user.getRole());
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(authoritySet)
                .build();
    }

    public UserDetails userToUserDetails(UserDto user) {
        if (user == null) {
            throw new IllegalArgumentException("User must not be null");
        }

        Set<GrantedAuthority> authoritySet = new HashSet<>();
        switch (user.getRole()) {
            case ADMIN:
                authoritySet.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                break;
            case USER:
                authoritySet.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
            default:
                throw new IllegalStateException("Unknown role: " + user.getRole());
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(authoritySet)
                .build();
    }


}
