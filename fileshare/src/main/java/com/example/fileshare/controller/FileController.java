package com.example.fileshare.controller;

import com.example.fileshare.model.File;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.UserRepository;
import com.example.fileshare.service.FileService;
import com.example.fileshare.service.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@Controller
@CrossOrigin
public class FileController {

    private final StorageService storageService;

    private final UserRepository userRepository;

    private final FileService fileService;

    public FileController(StorageService storageService, UserRepository userRepository, FileService fileService) {
        this.storageService = storageService;
        this.userRepository = userRepository;
        this.fileService = fileService;
    }


    @GetMapping("/file/download")
    @ResponseBody
    public ResponseEntity<Resource> downloadFile(@RequestParam("fileId") Integer fileId) {
        System.out.println("downloadFile");
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        File file = fileService.findFileById(fileId);
        if(file == null){
            System.out.println("file == null");
            return null;
        }
        if(!file.getAuthor().equals(user)){
            System.out.println("!file.getAuthor().equals(user)");
            return null;
        }
        Resource resource = storageService.loadAsResource(file.getName());
        if(resource == null){
            System.out.println("resource == null");
            return null;
        }
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @PostMapping("/file/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file,
                             @RequestParam(value = "parentId") Integer parentId) {
        System.out.println("uploadFile");
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        String StoredFileName = storageService.store(file);

        if(parentId == 0){
            System.out.println("fileService.save(user, name, null, true);");
            fileService.save(user, StoredFileName, null, false);
        }
        else{
            File parent = fileService.findFileById(parentId);
            if(parent != null && parent.getAuthor().equals(user)){
                fileService.save(user, StoredFileName, parent, false);
            }

        }
        return "redirect:/";
    }

    @DeleteMapping("file/delete")
    public ResponseEntity<Object> deleteFile(@RequestParam("fileId") Integer fileId){

        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        File file = fileService.findFileById(fileId);
        if(file == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if(file.getAuthor().equals(user)){
            storageService.delete(file.getName());

            fileService.delete(user, fileId);
        }
        else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().build();
    }
}
