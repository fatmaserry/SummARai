package com.summarai.summarai.model;

import jakarta.persistence.*;

import java.sql.Date;

@Entity
@DiscriminatorValue("USER")
public class UserSummary extends Summary {
    @Column
    private boolean is_public;
    @Column
    private Date creation_time;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    public boolean getIs_public() {
        return is_public;
    }

    public void setIs_public(boolean is_public) {
        this.is_public = is_public;
    }

    public Date getCreation_time() {
        return creation_time;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public void setCreation_time(Date creation_time) {
        this.creation_time = creation_time;
    }
}
