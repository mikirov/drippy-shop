package com.example.fileshare.service;

import com.example.fileshare.model.File;
import com.example.fileshare.model.User;

import java.util.List;

public interface FileService {

    void save(User user, String fileName, File parent, boolean isFolder);

    void delete(User user, int id);

    void updateName(User user, int id, String newName);

    void updateParent(User user, int id, File parent);

    List<File> findRootFiles(User user);

    List<File> findFiles(User user, File parent);

    File findFileById(int id);
}
