package com.example.fileshare.controller;

import com.example.fileshare.model.File;
import com.example.fileshare.model.Link;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.UserRepository;
import com.example.fileshare.service.FileService;
import com.example.fileshare.service.LinkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin
public class LinkController {


    private final LinkService linkService;

    private final FileService fileService;

    private final UserRepository userRepository;

    public LinkController(LinkService linkService, FileService fileService, UserRepository userRepository) {
        this.linkService = linkService;
        this.fileService = fileService;

        this.userRepository = userRepository;
    }




    @GetMapping("/link/{generatedName}")
    @ResponseStatus(HttpStatus.OK)
    public String getFile(Model model,
                          @PathVariable String generatedName)
    {
        Link link = this.linkService.getLinkByGeneratedName(generatedName);
        if(link == null){
            model.addAttribute("error", "Invalid link");
            return "index";
        }

        File file = this.fileService.findFileById(link.getFile().getId());
        List<File> files = new ArrayList<>();
        files.add(file);
        if(file.isFolder()){
            User owner = file.getAuthor();
            files.addAll(this.fileService.findFiles(owner, file));
        }
        model.addAttribute("files", files);
        return "index";
    }

    @PostMapping("/link/create")
    public ResponseEntity<Object> createLink(@RequestParam("id") Integer fileId){
        System.out.println("createLink");
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        File file = this.fileService.findFileById(fileId);
        if(!file.getAuthor().equals(user)){
            System.out.println("!file.getAuthor().equals(user)");
            return ResponseEntity.ok().body("Can't create link to file you don't own");
        }
        String generatedName = this.linkService.save(file);
        return  ResponseEntity.ok().body("http://localhost:8080/link/" + generatedName);
    }

    @DeleteMapping("/link/delete")
    public ResponseEntity<Object> deleteLink(@RequestParam("generatedName") String generatedName){
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        Link link = linkService.getLinkByGeneratedName(generatedName);

        if(!link.getFile().getAuthor().equals(user)){
            System.out.println("!file.getAuthor().equals(user)");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        this.linkService.delete(generatedName);
        return ResponseEntity.ok().build();
    }

}
