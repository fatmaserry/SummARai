package com.summarai.summarai.service.impl;

import java.time.LocalDate;

public interface DateTimeHelper {
    boolean isConsecutiveDay(LocalDate previousDate, LocalDate currentDate);
}
