package com.summarai.summarai.mapper;

import com.summarai.summarai.dto.RegisterDto;
import com.summarai.summarai.model.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RegisterMapper {

    public User toEntity(RegisterDto registerDto);



}
