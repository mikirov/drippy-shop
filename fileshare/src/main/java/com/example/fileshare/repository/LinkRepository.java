package com.example.fileshare.repository;


import com.example.fileshare.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LinkRepository extends JpaRepository<Link, Long> {

    @Query(value = "SELECT * FROM link l WHERE l.generated_name = ?1", nativeQuery = true)
    Link findByGeneratedName(String generatedName);

}
