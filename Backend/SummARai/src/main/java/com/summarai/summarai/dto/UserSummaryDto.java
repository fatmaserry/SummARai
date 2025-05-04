package com.summarai.summarai.dto;

import jakarta.persistence.Column;

import java.sql.Date;

public class UserSummaryDto extends SummaryDto{
    private boolean is_public;

    private Date creation_time ;

    public boolean isIs_public() {
        return is_public;
    }

    public void setIs_public(boolean is_public) {
        this.is_public = is_public;
    }

    public Date getCreation_time() {
        return creation_time;
    }

    public void setCreation_time(Date creation_time) {
        this.creation_time = creation_time;
    }
}
