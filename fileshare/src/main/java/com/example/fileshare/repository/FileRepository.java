package com.example.fileshare.repository;

import com.example.fileshare.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FileRepository extends JpaRepository<File, Integer> {

    @Query(value = "SELECT * FROM file f WHERE f.user_id = ?1", nativeQuery = true)
    List<File> findAllByAuthor(Integer userId);

    @Query(value = "SELECT * FROM file f WHERE f.user_id = ?1 AND f.parent_id = ?2", nativeQuery = true)
    List<File> findAllByAuthorAndParent(Integer userId, Integer parentId);

    @Query(value = "SELECT * FROM file f WHERE f.id = ?1", nativeQuery = true)
    Optional<File> findById(Integer id);
}
