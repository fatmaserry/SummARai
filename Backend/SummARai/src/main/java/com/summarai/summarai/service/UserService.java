package com.summarai.summarai.service;
import com.summarai.summarai.dto.RegisterDto;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.mapper.RegisterMapper;
import com.summarai.summarai.mapper.UserMapper;
import com.summarai.summarai.model.User;
import com.summarai.summarai.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
//@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RegisterMapper registerMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper, RegisterMapper registerMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.registerMapper = registerMapper;
    }

    public List<UserDto> findAll(){
        return userMapper.toDtos(userRepository.findAll());
    }
    public Optional<UserDto> findById(Long id){
        return userRepository.findById(id).map(userMapper::toDto);
    }
    public Optional<UserDto> addUser(RegisterDto registerDto){
        if(userRepository.existsByEmail(registerDto.getEmail()) || !registerDto.getPassword().equals(registerDto.getConfirmPassword()) ){
            return Optional.empty();
        }
        User user = userRepository.save(registerMapper.toEntity(registerDto));
        return Optional.ofNullable(userMapper.toDto(user));
    }
    public void deleteUser(Long id){
        userRepository.deleteById(id);
    }
}
