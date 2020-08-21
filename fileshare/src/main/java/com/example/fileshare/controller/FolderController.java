package com.example.fileshare.controller;

import com.example.fileshare.model.File;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.UserRepository;
import com.example.fileshare.service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@CrossOrigin
public class FolderController {

    private final FileService fileService;

    private final UserRepository userRepository;


    public FolderController(FileService fileService, UserRepository userRepository) {
        this.fileService = fileService;
        this.userRepository = userRepository;
    }



    @PostMapping("/folder/create")
    public ResponseEntity<Object> createFolder(@RequestParam("name") String name,
                                               @RequestParam("parentId") Integer parentId){
        System.out.println("createFolder");
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        if(parentId == 0){
            System.out.println("fileService.save(user, name, null, true);");
            fileService.save(user, name, null, true);
            return ResponseEntity.ok().build();
        }

        else {
            File parent = fileService.findFileById(parentId);
            if(parent.getAuthor().equals(user)){
                System.out.println("fileService.save(user, name, parent, true);");
                fileService.save(user, name, parent, true);
                return ResponseEntity.ok().build();
            }
            else{
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

    }


    @PutMapping("folder/update")
    public ResponseEntity<Object> updateFolder(@RequestParam(value = "newName", required = false) String newName,
                               @RequestParam("id") Integer folderId,
                               @RequestParam(value = "newParentId", required = false) Integer newParentId)
    {
        System.out.println("updateFolder");
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        if(newName == null && newParentId == null){
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        if(newName != null){
            fileService.updateName(user, folderId, newName);
            return ResponseEntity.ok().build();
        }
        if(newParentId != null){
            File parent = fileService.findFileById(newParentId);
            if(parent == null){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            if(parent.getAuthor().equals(user)){
                fileService.updateParent(user, folderId, parent);
                return ResponseEntity.ok().build();
            }
            else{
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return  ResponseEntity.ok().build();
    }

    @DeleteMapping("/folder/delete")
    public ResponseEntity<Object> deleteFolder(@RequestParam("id") Integer folderId)
    {
        System.out.println("deleteFolder");

        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        File file = fileService.findFileById(folderId);
        if(file == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        if(file.getAuthor().equals(user)){

            fileService.delete(user, folderId);
        }
        else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok().build();
    }

}
