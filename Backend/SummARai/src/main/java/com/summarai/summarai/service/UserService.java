package com.summarai.summarai.service;


import com.summarai.summarai.dto.RegisterDto;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.mapper.RegisterMapper;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.repository.ReadingsRepository;
import com.summarai.summarai.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
public interface UserService {
    public List<UserDto> findAll();
    public Optional<UserDto> findById(Long id);
    public Optional<UserDto> addUser(RegisterDto registerDto);
    public UserReading getReadings(Long id);
    public void deleteUser(Long id);
}
