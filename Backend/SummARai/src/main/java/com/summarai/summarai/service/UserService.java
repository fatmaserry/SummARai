package com.summarai.summarai.service;

import com.summarai.summarai.dto.GenreDto;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;
    public List<UserDto> findAll(){
        return userMapper.toDtos(userRepository.findAll());
    }
}
