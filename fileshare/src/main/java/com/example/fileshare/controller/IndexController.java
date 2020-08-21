package com.example.fileshare.controller;

import com.example.fileshare.model.File;
import com.example.fileshare.model.User;
import com.example.fileshare.repository.UserRepository;
import com.example.fileshare.service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin
public class IndexController {

    private final FileService fileService;

    private final UserRepository userRepository;

    public IndexController(FileService fileService, UserRepository userRepository) {
        this.fileService = fileService;
        this.userRepository = userRepository;
    }

    @GetMapping("/")
    @ResponseStatus(HttpStatus.OK)
    public String listAll(Model model, @RequestParam(value = "parentId", required = false) Integer parentId){
        System.out.println("listAll user:" + SecurityContextHolder.getContext().getAuthentication().getName());
        User user = userRepository.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());

        List<File> files = new ArrayList<>();
        if(parentId != null){
            File parent = fileService.findFileById(parentId);
            files.addAll(fileService.findFiles(user, parent));
        }
        else{
            files.addAll(fileService.findRootFiles(user));
        }
        model.addAttribute("files",files);
        return "index";
    }

}
