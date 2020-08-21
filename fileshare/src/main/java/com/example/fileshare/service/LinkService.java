package com.example.fileshare.service;

import com.example.fileshare.model.File;
import com.example.fileshare.model.Link;

public interface LinkService {
    Link getLinkByGeneratedName(String generatedName);

    String save(File file);

    void delete(String name);
}
