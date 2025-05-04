package com.summarai.summarai.dto;

import com.summarai.summarai.model.BookSummary;
import com.summarai.summarai.model.Genre;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class BookSpecs {

    public static Specification<BookSummary> authorContains(String author) {
        return (root, query, cb) ->
                cb.like(root.get("author").get("name"), "%" + author.toLowerCase() + "%");
    }

    public static Specification<BookSummary> titleContains(String title) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    /**
     * Matches books having any of the specified genres.
     */
    public static Specification<BookSummary> hasAnyGenre(List<String> genres) {
        return (root, query, cb) -> {
            // Avoid duplicate results
            query.distinct(true);
            Join<BookSummary, Genre> join = root.join("genres", JoinType.INNER);
            return join.get("description").in(genres);
        };
    }
}
