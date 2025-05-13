package com.summarai.summarai.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column
    private String name;
    @Column
    private String password;
    @Column(nullable = false,unique = true)
    private String email;
    @OneToOne(mappedBy = "user", orphanRemoval = true,cascade = CascadeType.ALL)
    private Statistics statistics;

    @OneToMany(mappedBy = "user", orphanRemoval = true,cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    private List<UserReading> myReadings;

    @Column
    private Role role;
    @OneToMany(mappedBy = "user")
    private List<Token> tokens;

    @Column(nullable = false)
    private boolean enabled = false;
    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return null;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Statistics getStatistics() {
        return statistics;
    }

    public void setStatistics(Statistics statistics) {
        if (statistics == null) {
            if (this.statistics != null) {
                this.statistics.setUser(null);
            }
        } else {
            statistics.setUser(this);
        }
        this.statistics = statistics;
    }

    public List<UserReading> getMyReadings() {
        return myReadings;
    }

    public void setMyReadings(List<UserReading> myReadings) {
        this.myReadings = myReadings;
    }

    public Role getRole() {
        return role;
    }
    public void setRole(Role role) {
        this.role = role;
    }
}
