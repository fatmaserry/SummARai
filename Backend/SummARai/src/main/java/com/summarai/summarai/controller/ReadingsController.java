package com.summarai.summarai.controller;
import com.summarai.summarai.dto.UserReadingDto;
import com.summarai.summarai.exception.ReadingNotFoundException;
import com.summarai.summarai.service.UserReadingsService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
@RestController
@RequestMapping("/api/readings")
public class ReadingsController {
    private final UserReadingsService userReadingsService;

    public ReadingsController(UserReadingsService userReadingsService) {
        this.userReadingsService = userReadingsService;
    }

    @GetMapping("/getReading")
    public ResponseEntity<UserReadingDto> getReading(@RequestParam Long summary_id) {
        UserReadingDto userReadingDto = userReadingsService.getReading(summary_id);
        return ResponseEntity.ok(userReadingDto);
    }

    @GetMapping("/getContinueReadings")
    public ResponseEntity<Page<UserReadingDto>> getReadings(Pageable pageable) {
        Page<UserReadingDto> readings = userReadingsService.getReadings(pageable);
        return ResponseEntity.ok(readings); // Always return 200 OK with Page, even if empty
    }

    @GetMapping("/getFinishedReadings")
    public ResponseEntity<Page<UserReadingDto>> getFinishedReadings(Pageable pageable) {
        Page<UserReadingDto> readings = userReadingsService.getFinishedReadings(pageable);
        return ResponseEntity.ok(readings); // Always return 200 OK with Page, even if empty
    }

   @PostMapping("/addReading")
   public ResponseEntity<UserReadingDto> addReading(@RequestParam Long summary_id) {
       UserReadingDto reading = userReadingsService.addReading(summary_id);
       return ResponseEntity
               .status(HttpStatus.CREATED)  // still use 201 for creation
               .body(reading);
   }

   @PostMapping("/setBookmark")
   public ResponseEntity<UserReadingDto> setBookmark(@RequestParam Long summary_id, @RequestParam Long bookmark) {
       UserReadingDto readingDto = userReadingsService.updateBookMark(summary_id, bookmark);
       return ResponseEntity
               .created(URI.create("/readings/" + readingDto.getId().getUser_id() + "/" + readingDto.getId().getSummary_id()))
               .body(readingDto);
   }

   @PostMapping("/finish")
    public ResponseEntity<UserReadingDto> finish(@RequestParam Long summary_id) {
       UserReadingDto readingDto = userReadingsService.finishReading(summary_id);
       return ResponseEntity
               .created(URI.create("/readings/" + readingDto.getId().getUser_id() + "/" + readingDto.getId().getSummary_id()))
               .body(readingDto);
   }

   @GetMapping("/hasReading")
    public ResponseEntity<?> hasReadings(@RequestParam Long summary_id) {
        try{
            UserReadingDto userReadingDto = userReadingsService.getReading(summary_id);
        }
        catch(ReadingNotFoundException e){
            return ResponseEntity.ok(false);
        }
        return ResponseEntity.ok(true);
   }

}
