package com.summarai.summarai.controller;
import com.summarai.summarai.dto.BookDto;
import com.summarai.summarai.dto.RegisterDto;
import com.summarai.summarai.dto.UserDto;
import com.summarai.summarai.model.UserReading;
import com.summarai.summarai.service.UserService;
import com.summarai.summarai.service.impl.UserServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
//@Tag(name = "user controller", description = "endpoints")
public class UserController {
    @Autowired
    private UserServiceImpl userService;

//    public UserController(UserService userService) {
//        this.userService = userService;
//    }

    @GetMapping("")
    public ResponseEntity<Page<UserDto>> getAllUsers(Pageable pageable){
        Page<UserDto> users = userService.findAll(pageable);
        return ResponseEntity.ok(users);
    }
    @GetMapping("/{id}")
    // admin method
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id){
        return userService.findById(id).map(ResponseEntity::ok).
                orElse(ResponseEntity.notFound().build());
    }
    // will  be adjusted based on current logging user
//    @GetMapping("/currentUser/{id}")
//    public ResponseEntity<UserDto> getUserById(){
//        return userService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
//    }

    // will  be adjusted based on current logging user
    @GetMapping("/readings/{id}")
    public ResponseEntity<List<UserReading>> getReadings(@PathVariable Long id){
        return ResponseEntity.ok(userService.getReadings(id));
    }
    @Operation(summary = "add a user")
    @PostMapping("")
    public ResponseEntity<?> addUser(@Validated @RequestBody RegisterDto registerDto){
        return ResponseEntity.ok(userService.addUser(registerDto));
    }
//    @PutMapping("/forget-password")
////    send reset password link over gmail.
//    public ResponseEntity<?> forgetPassword(@RequestParam String email){
//    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.ok("deleted");
    }


}
