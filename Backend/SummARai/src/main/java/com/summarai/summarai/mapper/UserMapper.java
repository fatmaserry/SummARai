package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.model.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    public UserDto toDto(User user);
    public User toEntity(UserDto userDto);
    public List<UserDto> toDtos(List<User> users);
    public List<User> toEntities(List<UserDto> userDtos);


}