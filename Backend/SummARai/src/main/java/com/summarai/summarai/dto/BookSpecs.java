package com.summarai.summarai.dto;

import com.summarai.summarai.model.Book;
import com.summarai.summarai.model.Genre;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class BookSpecs {

    public static Specification<Book> authorContains(String author) {
        return (root, query, cb) ->
                cb.like(root.get("author").get("name"), "%" + author.toLowerCase() + "%");
    }

    public static Specification<Book> titleContains(String title) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    /**
     * Matches books having any of the specified genres.
     */
    public static Specification<Book> hasAnyGenre(List<String> genres) {
        return (root, query, cb) -> {
            // Avoid duplicate results
            query.distinct(true);
            Join<Book, Genre> join = root.join("genres", JoinType.INNER);
            return join.get("description").in(genres);
        };
    }
}
