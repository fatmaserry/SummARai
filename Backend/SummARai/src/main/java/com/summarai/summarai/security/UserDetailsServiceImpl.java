package com.summarai.summarai.security;

import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.mapper.UserDetailsMapper;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final UserDetailsMapper userDetailsMapper;

    public UserDetailsServiceImpl(UserRepository userRepository, UserMapper userMapper, UserDetailsMapper userDetailsMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.userDetailsMapper = userDetailsMapper;
    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<com.summarai.summarai.model.User> user = userRepository.findByEmail(username);
        if (user.isPresent()) {
            return userDetailsMapper.userToUserDetails(user.get());
        }
        else{
            throw new UsernameNotFoundException(username);
        }
    }

    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return null;
    }
    public UserDto getCurrentUser() throws UsernameNotFoundException{
        com.summarai.summarai.model.User user = userRepository.findByEmail(getCurrentUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toDto(user);
    }
}
