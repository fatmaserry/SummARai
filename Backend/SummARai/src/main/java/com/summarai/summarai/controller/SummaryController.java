package com.summarai.summarai.controller;
import com.summarai.summarai.dto.BookSummaryDto;
import com.summarai.summarai.dto.GenreDto;
import com.summarai.summarai.dto.GenreDto;



import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.service.SummaryService;
import com.summarai.summarai.service.GenreService;
import com.summarai.summarai.service.S3Service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
public class SummaryController {
    private final SummaryService summaryService;
    private final S3Service s3Service;
    private final GenreService genreService;

    public SummaryController(SummaryService summaryService, S3Service s3Service, GenreService genreService) {
        this.summaryService = summaryService;
        this.s3Service = s3Service;
        this.genreService = genreService;
    }

    @GetMapping("/get_all")
    public ResponseEntity<Page<BookSummaryDto>> getAllBooks(Pageable pageable) {
        Page<BookSummaryDto> books = summaryService.getAllBooks(pageable);
        if(books.hasContent())
            return  ResponseEntity.status(HttpStatus.OK).body(books);
        return  ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // should be for admins only
    @PostMapping(value = "/add",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Secured("ROLE_ADMIN")
    public ResponseEntity<?> addBook(
            @ModelAttribute("bookSummary") BookSummaryDto bookSummary,
            @RequestParam("file") MultipartFile file) throws IOException {
        BookSummary saved = summaryService.saveBook(bookSummary, file);

        if(saved!=null)
            return ResponseEntity.status(HttpStatus.CREATED).body("Book added successfully");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Book not saved");
    }
    // should be for admins only

    @DeleteMapping("/delete/{fileName}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName){
        s3Service.deleteFile(fileName);
        return ResponseEntity.status(HttpStatus.OK).body("file "+fileName+ " was deleted.");

    }
    @GetMapping("/summary/{id}")
    public ResponseEntity<?> getSummary(@PathVariable Long id){
        String fileName = summaryService.getSummaryURL(id);
        if (fileName==null || fileName.isBlank())
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error","Summary file not found for book ID "+id));
        byte[] data = s3Service.downloadFile(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment",fileName);
        return new ResponseEntity<>(data,headers, HttpStatus.OK);
    }
    @GetMapping("/{book_id}")
    public ResponseEntity<?> getBookById(@PathVariable Long book_id) {
        Optional<SummaryDto> book = summaryService.getBookById(book_id);
        if(book.isPresent())
            return ResponseEntity.status(HttpStatus.OK).body(book);
//            return bookSummaryService.getBookById(book_id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping(params = "title")
    public ResponseEntity<Page<BookSummaryDto>> getBooksByTitle(@RequestParam String title, Pageable pageable) {
        Page<BookSummaryDto> books = summaryService.getBooksByTitle(title, pageable);
        if(books.hasContent())
            return ResponseEntity.status(HttpStatus.OK).body(books);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping(params = "genre")
    public ResponseEntity<Page<BookSummaryDto>> getBooksByGenre(@RequestParam String genre, Pageable pageable) {
        Page<BookSummaryDto> books = summaryService.getBooksByGenre(genre, pageable);
        if(books.hasContent())
            return ResponseEntity.status(HttpStatus.OK).body(books);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping(params = "author")
    public ResponseEntity<Page<BookSummaryDto>> getBooksByAuthor(@RequestParam String author, Pageable pageable) {
        Page<BookSummaryDto> books = summaryService.getBooksByAuthor(author, pageable);
        if(books.hasContent())
            return ResponseEntity.status(HttpStatus.OK).body(books);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }


    @PostMapping("/search")
    public ResponseEntity<Page<?>> search(@RequestBody BookSearchRequest criteria, Pageable pageable) {
        Page<?> books = summaryService.searchBooks(criteria, pageable);
        if(books.hasContent())
            return ResponseEntity.status(HttpStatus.OK).body(books);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/allGenres")
    private List<GenreDto> getAllGenres(){
        return genreService.getAllGenres();
    }

    @GetMapping("/mySummaries")
    private ResponseEntity<Page<UserSummaryDto>> getMySummaries(Pageable pageable){
        Page<UserSummaryDto> books = summaryService.getMySummaries(pageable);
        if(books.hasContent())
            return ResponseEntity.status(HttpStatus.OK).body(books);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateSummaryStatus(@RequestParam Long summary_id, @RequestParam Boolean status) {
        boolean updated = summaryService.updateSummaryStatus(summary_id, status);
        if (updated) {
            return ResponseEntity.ok("Status updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

//    @GetMapping("/allusers")
//    private List<UserDto> getAllUsers(){
//        return userService.getAllUsers();
//    }

}
