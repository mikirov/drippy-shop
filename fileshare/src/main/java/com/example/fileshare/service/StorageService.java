package com.example.fileshare.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

public interface StorageService {

    void init();

    String store(MultipartFile file);

    Path load(String filename);

    Resource loadAsResource(String filename);


    void deleteAll();

    List<Path> loadAll();

    void delete(String path);

    void update(String path, String oldName, String newName);

    void create(String path, String name);
}