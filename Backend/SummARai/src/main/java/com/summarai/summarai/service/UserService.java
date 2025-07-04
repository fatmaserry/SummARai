package com.summarai.summarai.service;
import com.summarai.summarai.dto.RegisterDto;
import com.summarai.summarai.dto.UpdateProfileDto;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.model.UserReading;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
public interface UserService {
    Page<UserDto> findAll(Pageable pageable);
    Optional<UserDto> findById(Long id);
    Optional<UserDto> addUser(RegisterDto registerDto);
    List<UserReading> getReadings(Long id);
    void deleteUser(Long id);
    UserDto updateUser(UpdateProfileDto updateProfileDto);
}
