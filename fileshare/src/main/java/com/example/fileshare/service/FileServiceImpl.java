package com.example.fileshare.service;

import com.example.fileshare.model.File;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.FileRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;

    public FileServiceImpl(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    @Override
    public void save(User user, String fileName, File parent, boolean isFolder) {
        File file = new File(fileName, user, parent);
        file.setFolder(isFolder);
        fileRepository.save(file);
    }

    @Override
    public void delete(User user, int id) {
        Optional<File> optionalFile = fileRepository.findById(id);
        if(optionalFile.isPresent()){
            File file = optionalFile.get();

            if(file.getAuthor().equals(user)){
                fileRepository.delete(file);
            }
        }
    }

    @Override
    public void updateName(User user, int id, String newName) {
        Optional<File> optionalFile = fileRepository.findById(id);
        if(optionalFile.isPresent()){
            File file = optionalFile.get();

            if(file.getAuthor().equals(user)){
                file.setName(newName);
                fileRepository.save(file);
            }
        }
    }

    @Override
    public void updateParent(User user, int id, File parent) {
        Optional<File> optionalFile = fileRepository.findById(id);
        if(optionalFile.isPresent()){
            File file = optionalFile.get();

            if(file.getAuthor().equals(user)){
                file.setParent(parent);
                fileRepository.save(file);
            }
        }

    }

    @Override
    public List<File> findRootFiles(User user) {
        return fileRepository
                .findAllByAuthor(user.getId())
                .stream()
                .filter(file -> file.parent == null)
                .collect(Collectors.toList());
    }

    @Override
    public List<File> findFiles(User user, File parent) {
        return fileRepository.findAllByAuthorAndParent(user.getId(), parent.getId());
    }


    @Override
    public File findFileById(int id) {
        Optional<File> optionalFile = fileRepository.findById(id);
        return optionalFile.orElse(null);
    }
}
