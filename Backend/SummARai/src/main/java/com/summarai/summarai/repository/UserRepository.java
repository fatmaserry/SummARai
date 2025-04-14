package com.summarai.summarai.repository;

import com.summarai.summarai.model.Book;
import com.summarai.summarai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Long> {

}
