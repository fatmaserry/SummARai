package com.summarai.summarai.service.impl;
import com.summarai.summarai.dto.RegisterDto;
import com.summarai.summarai.dto.UpdateProfileDto;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.mapper.RegisterMapper;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.model.Statistics;
import com.summarai.summarai.model.User;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.repository.ReadingsRepository;
import com.summarai.summarai.repository.UserRepository;
import com.summarai.summarai.security.UserDetailsServiceImpl;
import com.summarai.summarai.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ReadingsRepository readingsRepository;
    private final UserMapper userMapper;
    private final RegisterMapper registerMapper;
    private final UserDetailsServiceImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, ReadingsRepository readingsRepository, UserMapper userMapper, RegisterMapper registerMapper, UserDetailsServiceImpl userDetailsService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.readingsRepository = readingsRepository;
        this.userMapper = userMapper;
        this.registerMapper = registerMapper;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    public Page<UserDto> findAll(Pageable pageable){
        Page<User> users = userRepository.findAll(pageable);
        return users.map(userMapper::toDto);
    }
    public Optional<UserDto> findById(Long id){
        return userRepository.findById(id).map(userMapper::toDto);
    }
    public Optional<UserDto> addUser(RegisterDto registerDto){
        if(userRepository.existsByEmail(registerDto.getEmail()) ||
                !registerDto.getPassword().equals(registerDto.getConfirmPassword()) ){
            return Optional.empty();
        }
        User user = userRepository.save(registerMapper.toEntity(registerDto));
        user.setStatistics(new Statistics(user));
        return Optional.ofNullable(userMapper.toDto(user));
    }
    public List<UserReading> getReadings(Long id){
        return readingsRepository.findByUserId(id);
    }
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }

    public UserDto updateUser(UpdateProfileDto updateProfileDto) {
        Long userId = userDetailsService.getCurrentUser().getId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (updateProfileDto.getName() != null) {
            user.setName(updateProfileDto.getName());
        }

        if (updateProfileDto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updateProfileDto.getPassword()));
        }

        userRepository.save(user);
        return userMapper.toDto(user);
    }
}
