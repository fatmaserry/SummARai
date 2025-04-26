package com.summarai.summarai.service.impl;

import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.repository.UserRepository;
import com.summarai.summarai.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    public List<UserDto> getAllUsers() {
        return userMapper.toDtos(userRepository.findAll());
    }
}
